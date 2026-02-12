// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @notice 用于测试的 USDC 代币（6位小数）
 */
contract MockUSDC is ERC20 {
    uint8 private _decimals;

    constructor() ERC20("USD Coin", "USDC") {
        _decimals = 6;
        // 铸造 100万 USDC 给部署者
        _mint(msg.sender, 1_000_000 * 10**6);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @notice Faucet - 领取测试代币
     */
    function faucet(uint256 amount) external {
        _mint(msg.sender, amount * 10**6);
    }

    /**
     * @notice 批量转账
     */
    function batchTransfer(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external {
        require(recipients.length == amounts.length, "LENGTH_MISMATCH");

        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(msg.sender, recipients[i], amounts[i]);
        }
    }
}
