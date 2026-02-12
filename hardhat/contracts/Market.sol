// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./IMemeCurve.sol";

/**
 * @title Market
 * @notice Prediction market contract - supports AMM trading and on-chain data settlement
 * @dev Stage 0: AMM cold start | Stage 1: Hybrid | Stage 2: Orderbook dominant
 */
contract Market is ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ==================== Enums ====================

    enum Side { YES, NO }
    enum Stage { AMM, HYBRID, ORDERBOOK }
    enum Status { ACTIVE, RESOLVING, FINALIZED }

    // ==================== State Variables ====================

    // Basic info
    address public factory;
    address public collateralToken;     // USDC
    address public creator;
    string public question;
    uint256 public templateId;
    uint256 public resolutionTime;
    uint256 public questionId;

    // Settlement related
    address public targetCurve;         // Meme platform curve address
    address public targetToken;          // Meme token address
    uint8 public settleType;            // 0=GRADUATION, 1=MARKET_CAP_GE, 2=MARKET_CAP_LT
    uint256 public targetValue;          // Target value (e.g., target market cap)
    bool public resolved;                // Whether settled
    bool public finalResult;            // Final result (true=YES wins, false=NO wins)

    // Market state
    Stage public stage;
    Status public status;

    // AMM state (Bonding Curve)
    uint256 public yesReserve;
    uint256 public noReserve;
    uint256 public constant AMM_FEE_BPS = 30; // 0.3%
    uint256 public constant FEE_DIVISOR = 10000;

    // Price tracking
    uint256 public latestPrice;
    uint256 public totalVolume;
    uint256 public uniqueTraders;

    // User positions
    mapping(address => uint256) public yesBalance;
    mapping(address => uint256) public noBalance;
    mapping(address => bool) public hasTraded;

    // ==================== Events ====================

    event Trade(
        address indexed trader,
        Side side,
        uint256 amountIn,
        uint256 sharesOut,
        uint256 price,
        uint256 timestamp
    );

    event LiquidityAdded(
        address indexed provider,
        uint256 yesAmount,
        uint256 noAmount,
        uint256 timestamp
    );

    event StageUpgraded(
        Stage from,
        Stage to,
        uint256 timestamp
    );

    event Resolved(
        bool result,
        uint256 timestamp
    );

    event WinningsClaimed(
        address indexed winner,
        uint256 amount,
        uint256 timestamp
    );

    // ==================== Modifiers ====================

    modifier onlyActive() {
        require(status == Status.ACTIVE, "MARKET_NOT_ACTIVE");
        _;
    }

    modifier onlyCreator() {
        require(msg.sender == creator, "NOT_CREATOR");
        _;
    }

    // ==================== Constructor ====================

    constructor(
        address _factory,
        address _collateralToken,
        address _creator,
        string memory _question,
        uint256 _templateId,
        uint256 _resolutionTime,
        uint256 _initialYesPrice,
        address _targetToken,
        uint8 _settleType,
        uint256 _targetValue
    ) {
        factory = _factory;
        collateralToken = _collateralToken;
        creator = _creator;
        question = _question;
        templateId = _templateId;
        resolutionTime = _resolutionTime;
        stage = Stage.AMM;
        status = Status.ACTIVE;

        // Settlement related
        targetToken = _targetToken;
        settleType = _settleType;
        targetValue = _targetValue;
        resolved = false;

        // Initialize AMM liquidity (50/50)
        // Assume initial liquidity 1000 USDC equivalent
        yesReserve = 500 * 1e18;
        noReserve = 500 * 1e18;
        latestPrice = _initialYesPrice;
    }

    // ==================== AMM Trading Functions (Stage 0) ====================

    /**
     * @notice Buy YES/NO shares (using Bonding Curve)
     * @param side YES or NO
     * @param amountIn Amount of collateral to pay (USDC)
     */
    function buy(Side side, uint256 amountIn)
        external
        nonReentrant
        onlyActive
        returns (uint256 sharesOut)
    {
        require(amountIn > 0, "INVALID_AMOUNT");

        // Transfer collateral
        IERC20(collateralToken).safeTransferFrom(msg.sender, address(this), amountIn);

        // Calculate fee
        uint256 fee = (amountIn * AMM_FEE_BPS) / FEE_DIVISOR;
        uint256 amountInAfterFee = amountIn - fee;

        // Calculate output shares based on direction
        if (side == Side.YES) {
            // Use constant product formula: x * y = k
            sharesOut = calculateSwapOutput(amountInAfterFee, yesReserve, noReserve);
            yesReserve += amountInAfterFee;
            noReserve -= sharesOut;
            yesBalance[msg.sender] += sharesOut;
        } else {
            sharesOut = calculateSwapOutput(amountInAfterFee, noReserve, yesReserve);
            noReserve += amountInAfterFee;
            yesReserve -= sharesOut;
            noBalance[msg.sender] += sharesOut;
        }

        // Update stats
        if (!hasTraded[msg.sender]) {
            hasTraded[msg.sender] = true;
            uniqueTraders++;
        }
        totalVolume += amountIn;
        latestPrice = (yesReserve * 1e18) / (yesReserve + noReserve);

        emit Trade(msg.sender, side, amountIn, sharesOut, latestPrice, block.timestamp);
    }

    /**
     * @notice Sell YES/NO shares
     * @param side YES or NO
     * @param sharesIn Amount of shares to sell
     */
    function sell(Side side, uint256 sharesIn)
        external
        nonReentrant
        onlyActive
        returns (uint256 amountOut)
    {
        require(sharesIn > 0, "INVALID_AMOUNT");

        // Calculate output amount
        uint256 fee;
        if (side == Side.YES) {
            require(yesBalance[msg.sender] >= sharesIn, "INSUFFICIENT_BALANCE");
            yesBalance[msg.sender] -= sharesIn;

            amountOut = calculateSwapOutput(sharesIn, noReserve, yesReserve);
            fee = (amountOut * AMM_FEE_BPS) / FEE_DIVISOR;
            amountOut -= fee;

            yesReserve -= amountOut + fee;
            noReserve += sharesIn;
        } else {
            require(noBalance[msg.sender] >= sharesIn, "INSUFFICIENT_BALANCE");
            noBalance[msg.sender] -= sharesIn;

            amountOut = calculateSwapOutput(sharesIn, yesReserve, noReserve);
            fee = (amountOut * AMM_FEE_BPS) / FEE_DIVISOR;
            amountOut -= fee;

            noReserve -= amountOut + fee;
            yesReserve += sharesIn;
        }

        // Transfer collateral out
        IERC20(collateralToken).safeTransfer(msg.sender, amountOut);

        // Update price
        latestPrice = (yesReserve * 1e18) / (yesReserve + noReserve);

        emit Trade(msg.sender, side, sharesIn, amountOut, latestPrice, block.timestamp);
    }

    /**
     * @notice Constant product formula: x * y = k
     */
    function calculateSwapOutput(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256) {
        return (amountIn * reserveOut) / (reserveIn + amountIn);
    }

    // ==================== Settlement Functions ====================

    /**
     * @notice Settle market - only callable by Settlement contract
     * @param result true=YES wins, false=NO wins
     */
    function resolve(bool result) external {
        require(
            msg.sender == factory || _isSettlementContract(),
            "NOT_AUTHORIZED"
        );
        require(!resolved, "ALREADY_RESOLVED");
        require(status == Status.ACTIVE, "NOT_ACTIVE");
        require(block.timestamp >= resolutionTime, "NOT_YET_RESOLVABLE");

        resolved = true;
        finalResult = result;
        status = Status.FINALIZED;

        emit Resolved(result, block.timestamp);
    }

    /**
     * @notice Winner claims their winnings
     */
    function claimWinnings() external nonReentrant {
        require(resolved, "NOT_RESOLVED");

        uint256 yesShares = yesBalance[msg.sender];
        uint256 noShares = noBalance[msg.sender];

        require(yesShares > 0 || noShares > 0, "NO_HOLDINGS");

        uint256 payout;
        if (finalResult) {
            // YES wins: YES shares redeemed 1:1, NO shares become worthless
            payout = yesShares;
            yesBalance[msg.sender] = 0;
            noBalance[msg.sender] = 0;
        } else {
            // NO wins: NO shares redeemed 1:1, YES shares become worthless
            payout = noShares;
            noBalance[msg.sender] = 0;
            yesBalance[msg.sender] = 0;
        }

        IERC20(collateralToken).safeTransfer(msg.sender, payout);

        emit WinningsClaimed(msg.sender, payout, block.timestamp);
    }

    /**
     * @notice Get settlement information
     */
    function getSettlementInfo() external view returns (
        address curve,
        uint8 _settleType,
        uint256 _targetValue,
        uint256 _resolutionTime
    ) {
        return (targetCurve, settleType, targetValue, resolutionTime);
    }

    /**
     * @notice Set target curve address (called by Factory)
     */
    function setTargetCurve(address _targetCurve) external {
        require(msg.sender == factory, "NOT_FACTORY");
        require(targetCurve == address(0), "ALREADY_SET");
        targetCurve = _targetCurve;
    }

    /**
     * @notice Check if caller is the settlement contract
     */
    function _isSettlementContract() internal view returns (bool) {
        // Get settlement contract address from factory
        (, bytes memory data) = factory.staticcall(
            abi.encodeWithSignature("settlementContract()")
        );
        address settlementContract = abi.decode(data, (address));
        return msg.sender == settlementContract;
    }

    // ==================== Price Query ====================

    /**
     * @notice Get current YES price (18 decimals)
     */
    function getYesPrice() external view returns (uint256) {
        return (yesReserve * 1e18) / (yesReserve + noReserve);
    }

    /**
     * @notice Get current NO price (18 decimals)
     */
    function getNoPrice() external view returns (uint256) {
        return (noReserve * 1e18) / (yesReserve + noReserve);
    }

    /**
     * @notice Preview trade output
     */
    function getBuyOutcome(Side side, uint256 amountIn)
        external view returns (uint256 sharesOut, uint256 price)
    {
        uint256 amountInAfterFee = (amountIn * (FEE_DIVISOR - AMM_FEE_BPS)) / FEE_DIVISOR;

        if (side == Side.YES) {
            sharesOut = calculateSwapOutput(amountInAfterFee, yesReserve, noReserve);
        } else {
            sharesOut = calculateSwapOutput(amountInAfterFee, noReserve, yesReserve);
        }

        price = (yesReserve * 1e18) / (yesReserve + noReserve);
    }

    // ==================== Stage Upgrade ====================

    /**
     * @notice Upgrade market stage (0->1->2)
     */
    function upgradeStage() external onlyActive {
        require(stage == Stage.AMM, "ALREADY_UPGRADED");

        // MVP simplified: manual upgrade, production should be triggered by Indexer
        Stage newStage = stage == Stage.AMM ? Stage.HYBRID :
                        stage == Stage.HYBRID ? Stage.ORDERBOOK : Stage.ORDERBOOK;

        stage = newStage;

        emit StageUpgraded(stage, newStage, block.timestamp);
    }

    // ==================== Query Functions ====================

    /**
     * @notice Get user position
     */
    function getUserPosition(address user)
        external view returns (uint256 yesAmount, uint256 noAmount)
    {
        return (yesBalance[user], noBalance[user]);
    }

    /**
     * @notice Get market reserves
     */
    function getReserves() external view returns (uint256 yes, uint256 no) {
        return (yesReserve, noReserve);
    }

    /**
     * @notice Get market information
     */
    function getMarketInfo()
        external view returns (
            string memory _question,
            Stage _stage,
            Status _status,
            uint256 _yesReserve,
            uint256 _noReserve,
            uint256 _latestPrice,
            uint256 _totalVolume,
            uint256 _uniqueTraders,
            bool _resolved,
            bool _finalResult
        )
    {
        return (
            question,
            stage,
            status,
            yesReserve,
            noReserve,
            latestPrice,
            totalVolume,
            uniqueTraders,
            resolved,
            finalResult
        );
    }

    // ==================== Emergency Controls ====================

    function pause() external onlyCreator {
        _pause();
    }

    function unpause() external onlyCreator {
        _unpause();
    }
}
