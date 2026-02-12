// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../MockUSDC.sol";
import "../MarketFactory.sol";
import "../Settlement.sol";

/**
 * @title DeployScript
 * @notice Deploy all contracts for Base mainnet
 */
contract DeployScript is Script {
    MockUSDC usdc;
    MarketFactory factory;
    Settlement settlement;

    // Base mainnet addresses
    address constant MEME_FACTORY = 0x07DFAEC8e182C5eF79844ADc70708C1c15aA60fb;
    // Base mainnet USDC (will be replaced with actual address for testing)
    address constant BASE_USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA029; // Mock for now, replace with real USDC

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Mock USDC (or use real USDC on mainnet)
        usdc = new MockUSDC();
        console.log("USDC deployed:", address(usdc));

        // 2. Deploy Settlement (with Meme Factory address)
        settlement = new Settlement(MEME_FACTORY);
        console.log("Settlement deployed:", address(settlement));

        // 3. Deploy MarketFactory
        factory = new MarketFactory(
            address(usdc),     // collateralToken
            0.001 ether,       // creationBond (0.001 ETH ~ $2-3)
            msg.sender,         // treasury
            MEME_FACTORY        // memeFactory
        );
        console.log("MarketFactory deployed:", address(factory));

        // 4. Set Settlement contract in Factory
        factory.setSettlementContract(address(settlement));
        console.log("Settlement contract set in Factory");

        // 5. Transfer USDC to Factory (for initial liquidity if needed)
        usdc.transfer(address(factory), 100_000 * 10**6);
        console.log("Transferred 100k USDC to Factory");

        vm.stopBroadcast();

        // Output deployment summary
        console.log("\n=== Deployment Summary ===");
        console.log("Network: Base Mainnet");
        console.log("USDC:", address(usdc));
        console.log("MarketFactory:", address(factory));
        console.log("Settlement:", address(settlement));
        console.log("Meme Factory:", MEME_FACTORY);
        console.log("Owner:", msg.sender);
        console.log("\n=== Verification Commands ===");
        console.log("To verify on BaseScan:");
        console.log("1. Settlement: forge verify-contract --chain-id 8453 --watch");
        console.log("2. MarketFactory: forge verify-contract --chain-id 8453 --watch");
    }

    /**
     * @notice Deploy to testnet (for testing)
     */
    function runTestnet() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Mock USDC
        usdc = new MockUSDC();
        console.log("USDC deployed:", address(usdc));

        // 2. Deploy Settlement
        settlement = new Settlement(address(0)); // No meme factory on testnet
        console.log("Settlement deployed:", address(settlement));

        // 3. Deploy MarketFactory
        factory = new MarketFactory(
            address(usdc),
            0.0001 ether,      // Lower bond for testnet
            msg.sender,
            address(0)           // No meme factory on testnet
        );
        console.log("MarketFactory deployed:", address(factory));

        // 4. Set Settlement contract
        factory.setSettlementContract(address(settlement));

        // 5. Transfer USDC
        usdc.transfer(address(factory), 100_000 * 10**6);

        vm.stopBroadcast();

        console.log("\n=== Testnet Deployment Complete ===");
    }
}
