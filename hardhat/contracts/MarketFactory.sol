// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Market.sol";
import "./IMemeFactory.sol";

/**
 * @title MarketFactory
 * @notice Factory contract for creating prediction markets
 * @dev Supports templated parameters and collects creation bonds to prevent spam
 */
contract MarketFactory {

    // ==================== State Variables ====================

    address public owner;
    address public treasury;
    address public settlementContract;  // Settlement contract address
    address public memeFactory;         // Meme platform factory address (Base mainnet)

    // Creation bond (anti-spam)
    uint256 public creationBond;
    address public collateralToken; // USDC

    // Market list
    address[] public markets;
    mapping(address => bool) public isMarket;

    // Creator stats
    mapping(address => uint256) public creatorMarketsCount;
    mapping(address => uint256) public creatorBondDeposited;

    // ==================== Events ====================

    event MarketCreated(
        address indexed market,
        address indexed creator,
        uint256 templateId,
        bytes32 paramsHash,
        uint256 questionId,
        string question,
        address targetToken,
        uint8 settleType,
        uint256 targetValue
    );

    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event CreationBondUpdated(uint256 oldBond, uint256 newBond);
    event SettlementContractUpdated(address indexed oldContract, address indexed newContract);
    event MemeFactoryUpdated(address indexed oldFactory, address indexed newFactory);

    // ==================== Modifiers ====================

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    // ==================== Constructor ====================

    constructor(
        address _collateralToken,
        uint256 _creationBond,
        address _treasury,
        address _memeFactory
    ) {
        owner = msg.sender;
        collateralToken = _collateralToken;
        creationBond = _creationBond;
        treasury = _treasury;
        memeFactory = _memeFactory;
    }

    // ==================== Core Functions ====================

    /**
     * @notice Create a new prediction market
     * @param question Market question
     * @param templateId Template ID (0=binary, 1=scalar, etc.)
     * @param resolutionTime Resolution timestamp
     * @param initialYesPrice Initial YES price (1e18 = 100%)
     * @param targetToken Meme token address
     * @param settleType Settlement type (0=graduation, 1=market_cap>=X, 2=market_cap<X)
     * @param targetValue Target value (for market cap predictions)
     */
    function createMarket(
        string calldata question,
        uint256 templateId,
        uint256 resolutionTime,
        uint256 initialYesPrice,
        address targetToken,
        uint8 settleType,
        uint256 targetValue
    ) external payable returns (address market) {
        // Check bond
        require(msg.value >= creationBond, "INSUFFICIENT_BOND");

        // Check settlement type
        require(settleType <= 2, "INVALID_SETTLE_TYPE");

        // Transfer bond to treasury
        if (msg.value > 0) {
            payable(treasury).transfer(msg.value);
            creatorBondDeposited[msg.sender] += msg.value;
        }

        // Get curve address from Meme Factory
        address curveAddress = IMemeFactory(memeFactory).tokenToCurve(targetToken);
        require(curveAddress != address(0), "CURVE_NOT_FOUND");

        // Deploy market contract
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, block.timestamp, question, targetToken));
        market = address(new Market{salt: salt}(
            address(this),
            collateralToken,
            msg.sender,
            question,
            templateId,
            resolutionTime,
            initialYesPrice,
            targetToken,
            settleType,
            targetValue
        ));

        // Set curve address
        Market(market).setTargetCurve(curveAddress);

        // Record market
        markets.push(market);
        isMarket[market] = true;
        creatorMarketsCount[msg.sender]++;

        // Generate params hash (immutable record)
        bytes32 paramsHash = keccak256(abi.encodePacked(
            question,
            templateId,
            resolutionTime,
            initialYesPrice,
            targetToken,
            settleType,
            targetValue
        ));

        emit MarketCreated(
            market,
            msg.sender,
            templateId,
            paramsHash,
            markets.length - 1,
            question,
            targetToken,
            settleType,
            targetValue
        );
    }

    /**
     * @notice Get all market addresses
     */
    function getMarkets() external view returns (address[] memory) {
        return markets;
    }

    /**
     * @notice Get market count
     */
    function getMarketsCount() external view returns (uint256) {
        return markets.length;
    }

    // ==================== Admin Functions ====================

    function setTreasury(address _treasury) external onlyOwner {
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }

    function setCreationBond(uint256 _creationBond) external onlyOwner {
        emit CreationBondUpdated(creationBond, _creationBond);
        creationBond = _creationBond;
    }

    function setSettlementContract(address _settlementContract) external onlyOwner {
        emit SettlementContractUpdated(settlementContract, _settlementContract);
        settlementContract = _settlementContract;
    }

    function setMemeFactory(address _memeFactory) external onlyOwner {
        emit MemeFactoryUpdated(memeFactory, _memeFactory);
        memeFactory = _memeFactory;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}
