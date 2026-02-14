const hre = require("hardhat");
const { ethers } = hre;
const { expect } = require("chai");

async function main() {
    console.log("=== Starting Fork Verification (Node Direct) ===");

    // 1. Constants
    const MEME_FACTORY_ADDRESS = "0x07DFAEC8e182C5eF79844ADc70708C1c15aA60fb"; // From previous context / inferred
    const TOKEN_ADDRESS = "0xcc095d17f3035e768ea88168382def86ca6bf808"; // Provided by user
    const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base Mainnet USDC

    // 2. Impersonate a wealthy account (e.g., Binance or a known whale on Base)
    // For simplicity, we can just use the local signer and pretend they have ETH (Hardhat fork default).
    const [deployer] = await ethers.getSigners();
    console.log(`Deployer: ${deployer.address}`);

    // 3. Verify Factory & Curve
    console.log("\n--- Verifying Meme Factory & Curve ---");
    const memeFactory = await ethers.getContractAt("IMemeFactory", MEME_FACTORY_ADDRESS);

    // Check if Factory exists
    const code = await ethers.provider.getCode(MEME_FACTORY_ADDRESS);
    if (code === "0x") {
        console.error("❌ Meme Factory contract not found at address!");
        return;
    }
    console.log("✅ Meme Factory found.");

    // Look up Curve for Token
    console.log(`Looking up curve for token: ${TOKEN_ADDRESS}`);
    const curveAddress = await memeFactory.tokenToCurve(TOKEN_ADDRESS);
    console.log(`Curve Address: ${curveAddress}`);

    if (curveAddress === ethers.ZeroAddress) {
        console.error("❌ Token does not map to a curve on this Factory!");
        return;
    }

    // Check isCurve
    const isValid = await memeFactory.isCurve(curveAddress);
    console.log(`isCurve(${curveAddress}): ${isValid}`);
    if (!isValid) {
        console.error("❌ Factory says this is NOT a valid curve!");
        // Proceed anyway to see if our contract logic catches it
    } else {
        console.log("✅ Curve is valid.");
    }

    // 4. Deploy ProbForge Contracts
    console.log("\n--- Deploying ProbForge Contracts ---");

    // Settlement
    const Settlement = await ethers.getContractFactory("Settlement");
    const settlement = await Settlement.deploy(MEME_FACTORY_ADDRESS);
    await settlement.waitForDeployment();
    console.log(`✅ Settlement deployed to: ${await settlement.getAddress()}`);

    // MarketFactory
    const MarketFactory = await ethers.getContractFactory("MarketFactory");
    const creationBond = ethers.parseEther("0.01");
    const marketFactory = await MarketFactory.deploy(
        USDC_ADDRESS,
        creationBond,
        deployer.address,
        MEME_FACTORY_ADDRESS
    );
    await marketFactory.waitForDeployment();
    console.log(`✅ MarketFactory deployed to: ${await marketFactory.getAddress()}`);

    // Link Settlement
    await marketFactory.setSettlementContract(await settlement.getAddress());

    // 5. Create Market for this Curve
    console.log("\n--- Creating Prediction Market ---");

    const question = "Will this token graduate?";
    const templateId = 0; // Binary
    const resolutionTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const initialYesPrice = ethers.parseEther("0.5");
    const settleType = 0; // GRADUATION
    const targetValue = 0; // Irrelevant for graduation

    console.log("Creating market with params:");
    console.log(`- Token: ${TOKEN_ADDRESS}`);
    console.log(`- SettleType: ${settleType} (GRADUATION)`);

    const tx = await marketFactory.createMarket(
        question,
        templateId,
        resolutionTime,
        initialYesPrice,
        TOKEN_ADDRESS,
        settleType,
        targetValue,
        { value: creationBond }
    );

    console.log("Transaction sent. Waiting for confirmation...");
    const receipt = await tx.wait();

    // Parse logs to find Market Address
    const event = receipt.logs.find(log => {
        try {
            return marketFactory.interface.parseLog(log)?.name === "MarketCreated";
        } catch (e) { return false; }
    });
    const parsedLog = marketFactory.interface.parseLog(event);
    const marketAddress = parsedLog.args.market;
    console.log(`✅ Market created at: ${marketAddress}`);

    // 6. Simulate Time Passing (if needed for resolution)
    // Resolution time is 1 hour in future.
    // Settlement checks: block.timestamp >= resolutionTime
    console.log("\n--- Simulating Time Passing ---");
    await time.increaseTo(resolutionTime + 1);
    console.log("Time advanced past resolution time.");

    // 7. Check Settlement Preview
    console.log("\n--- Checking Settlement Preview ---");
    // We can use Settlement.previewSettlement(market)

    try {
        const [result, settleValue] = await settlement.previewSettlement(marketAddress);
        console.log(`Preview Result: ${result ? "YES" : "NO"}`);
        console.log(`Settle Value: ${settleValue}`);
    } catch (e) {
        console.error("Preview failed:", e.message);
        // If preview fails, it might be because of the isCurve check if we didn't mock it or if the fork doesn't have it.
        // But we verified isCurve above.
    }

    // 8. Execute Settlement
    console.log("\n--- Executing Settlement ---");
    try {
        const settleTx = await settlement.settle(marketAddress);
        await settleTx.wait();
        console.log("✅ Settlement transaction successful!");

        // Verify Market State
        const Market = await ethers.getContractFactory("Market");
        const market = Market.attach(marketAddress);
        const info = await market.getMarketInfo();
        console.log(`Market Final Result: ${info._finalResult ? "YES" : "NO"}`);
        console.log(`Market Resolved: ${info._resolved}`);

    } catch (e) {
        console.error("❌ Settlement failed:", e.message);
    }
}

// Add time helper
const { time } = require("@nomicfoundation/hardhat-network-helpers");

main().catch(console.error);
