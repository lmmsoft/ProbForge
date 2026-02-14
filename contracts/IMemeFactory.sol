// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IMemeFactory
 * @notice Interface for Meme platform factory contract
 * @dev Used to resolve token address to curve address
 */
interface IMemeFactory {
    /// @notice Get the curve address for a given token
    /// @param token The token address
    /// @return curve The bonding curve address
    function tokenToCurve(address token) external view returns (address);

    /// @notice Get total number of curves
    function totalCurves() external view returns (uint256);

    /// @notice Check if an address is a valid curve
    function isCurve(address curve) external view returns (bool);
}
