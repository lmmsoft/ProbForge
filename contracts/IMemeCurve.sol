// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IMemeCurve
 * @notice Interface for Meme platform bonding curve contract
 * @dev This interface is used to read on-chain data for settlement
 */
interface IMemeCurve {
    /// @notice Get current price (in ETH)
    function getCurrentPrice() external view returns (uint256);

    /// @notice Get current market cap (in ETH)
    function getMarketCap() external view returns (uint256);

    /// @notice Check if the token has graduated
    function graduated() external view returns (bool);

    /// @notice Get graduation information
    function getGraduationInfo() external view returns (
        bool graduated,
        uint256 progress,
        uint256 ethCollected,
        uint256 threshold,
        address pool,
        uint256 graduatedAt,
        uint256 lpTokensBurned
    );

    /// @notice Get the token address
    function token() external view returns (address);

    /// @notice Get the token name
    function name() external view returns (string memory);

    /// @notice Get the token symbol
    function symbol() external view returns (string memory);
}
