
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../IMemeFactory.sol";

contract MockMemeFactory is IMemeFactory {
    mapping(address => address) public tokenCurve;
    mapping(address => bool) public curves;

    function setTokenCurve(address token, address curve) external {
        tokenCurve[token] = curve;
    }

    function setIsCurve(address curve, bool valid) external {
        curves[curve] = valid;
    }

    function tokenToCurve(address token) external view override returns (address) {
        return tokenCurve[token];
    }

    function isCurve(address curve) external view override returns (bool) {
        return curves[curve];
    }

    function totalCurves() external pure override returns (uint256) {
        return 0;
    }
}
