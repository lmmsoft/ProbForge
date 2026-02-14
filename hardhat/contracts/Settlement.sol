// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Market.sol";
import "./IMemeCurve.sol";
import "./IMemeFactory.sol";

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
        uint8 settleTypeInt;
        (
            address targetCurve,
            uint8 _settleType,
            uint256 targetValue,
            uint256 resolutionTime
        ) = Market(market).getSettlementInfo();
        
        SettlementType settleType = SettlementType(_settleType);

        // 2. Check if resolution time has reached
        require(block.timestamp >= resolutionTime, "NOT_YET_RESOLVABLE");
        require(Market(market).status() == Market.Status.ACTIVE, "NOT_ACTIVE");

        // 3. Verify curve validity
        require(IMemeFactory(memeFactory).isCurve(targetCurve), "INVALID_CURVE");

        // 4. Read Meme platform on-chain data and determine result
        result = _determineResult(targetCurve, settleType, targetValue);

        // 5. Execute market settlement
        Market(market).resolve(result);

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
        uint8 _settleType;
        (
            address targetCurve,
            uint8 settleTypeInt,
            uint256 targetValue,
        ) = Market(market).getSettlementInfo();
        
        result = _determineResult(targetCurve, SettlementType(settleTypeInt), targetValue);
        settleValue = _getSettleValue(targetCurve, SettlementType(settleTypeInt));
    }
}
