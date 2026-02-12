// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Market.sol";
import "./IMemeCurve.sol";

/**
 * @title Settlement
 * @notice Direct settlement by reading Meme platform on-chain data
 * @dev Removes optimistic settlement, settles based on on-chain data verification
 */
contract Settlement {

    // ==================== Settlement Types ====================

    enum SettlementType {
        GRADUATION,    // 0: Will graduate?
        MARKET_CAP_GE,  // 1: Market cap >= X?
        MARKET_CAP_LT   // 2: Market cap < X?
    }

    // ==================== Events ====================

    event MarketSettled(
        address indexed market,
        address indexed curve,
        SettlementType settleType,
        bool result,           // true = YES wins, false = NO wins
        uint256 settleValue    // Actual settlement value (e.g., market cap)
    );

    // ==================== State Variables ====================

    address public immutable memeFactory;

    // ==================== Constructor ====================

    constructor(address _memeFactory) {
        memeFactory = _memeFactory;
    }

    // ==================== Core Settlement Functions ====================

    /**
     * @notice Settle a market by reading on-chain data
     * @param market The market address to settle
     */
    function settle(address market) external returns (bool result) {
        // 1. Get market configuration
        (
            address targetCurve,
            SettlementType settleType,
            uint256 targetValue,
            uint256 resolutionTime
        ) = IMarket(market).getSettlementInfo();

        // 2. Check if resolution time has reached
        require(block.timestamp >= resolutionTime, "NOT_YET_RESOLVABLE");
        require(IMarket(market).status() == IMarket.Status.ACTIVE, "NOT_ACTIVE");

        // 3. Read Meme platform on-chain data and determine result
        result = _determineResult(targetCurve, settleType, targetValue);

        // 4. Execute market settlement
        IMarket(market).resolve(result);

        // 5. Record actual settlement value (for frontend display)
        uint256 settleValue = _getSettleValue(targetCurve, settleType);

        emit MarketSettled(market, targetCurve, settleType, result, settleValue);
    }

    /**
     * @notice Determine result based on settlement type
     */
    function _determineResult(
        address curve,
        SettlementType settleType,
        uint256 targetValue
    ) internal view returns (bool) {
        IMemeCurve memeCurve = IMemeCurve(curve);

        if (settleType == SettlementType.GRADUATION) {
            // A: Will graduate? -> graduated() == true means YES wins
            return memeCurve.graduated();

        } else if (settleType == SettlementType.MARKET_CAP_GE) {
            // B: Market cap >= X? -> getMarketCap() >= targetValue means YES wins
            uint256 marketCap = memeCurve.getMarketCap();
            return marketCap >= targetValue;

        } else if (settleType == SettlementType.MARKET_CAP_LT) {
            // C: Market cap < X? -> getMarketCap() < targetValue means YES wins
            uint256 marketCap = memeCurve.getMarketCap();
            return marketCap < targetValue;
        }

        revert("INVALID_SETTLEMENT_TYPE");
    }

    /**
     * @notice Get settlement value (for event logging)
     */
    function _getSettleValue(address curve, SettlementType settleType) internal view returns (uint256) {
        IMemeCurve memeCurve = IMemeCurve(curve);

        if (settleType == SettlementType.GRADUATION) {
            (bool graduated,, , , , ,) = memeCurve.getGraduationInfo();
            return graduated ? 1 : 0;
        } else {
            return memeCurve.getMarketCap();
        }
    }

    /**
     * @notice Preview settlement result (query only, does not execute)
     */
    function previewSettlement(address market)
        external
        view
        returns (bool result, uint256 settleValue)
    {
        (
            address targetCurve,
            SettlementType settleType,
            uint256 targetValue,
        ) = IMarket(market).getSettlementInfo();

        result = _determineResult(targetCurve, settleType, targetValue);
        settleValue = _getSettleValue(targetCurve, settleType);
    }
}
