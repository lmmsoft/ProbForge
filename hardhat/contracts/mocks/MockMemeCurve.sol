
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../IMemeCurve.sol";

contract MockMemeCurve is IMemeCurve {
    bool public _graduated;
    uint256 public _marketCap;

    function setGraduated(bool val) external {
        _graduated = val;
    }

    function setMarketCap(uint256 val) external {
        _marketCap = val;
    }

    function graduated() external view override returns (bool) {
        return _graduated;
    }

    function getMarketCap() external view override returns (uint256) {
        return _marketCap;
    }

    function getCurrentPrice() external view override returns (uint256) {
        return 0;
    }

    function getGraduationInfo() external view override returns (bool, uint256, uint256, uint256, address, uint256, uint256) {
        return (_graduated, 0, 0, 0, address(0), 0, 0);
    }
    
    // Other functions from interface if needed, dummy implementation
    function token() external view override returns (address) { return address(0); }
    function name() external view override returns (string memory) { return ""; }
    function symbol() external view override returns (string memory) { return ""; }

}
