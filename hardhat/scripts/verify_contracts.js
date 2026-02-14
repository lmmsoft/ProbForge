const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    console.log("=== Verifying Contracts on Etherscan (Base) ===\n");

    const settlementAddress = "0x3542234ad4c8edD8fb395892Db2F49E5B547ba0A";
    const factoryAddress = "0xC227c2ED7a474e36569338bB19F4399cFed92809";

    const usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
    const memeFactoryAddress = "0x07DFAEC8e182C5eF79844ADc70708C1c15aA60fb";
    const creationBond = ethers.parseEther("0.01");
    const deployerAddress = "0xC8300D749584ca940B90817753F5b1ea6f26d57b"; // From deployment log

    console.log("1. Verifying Settlement...");
    try {
        await hre.run("verify:verify", {
            address: settlementAddress,
            constructorArguments: [memeFactoryAddress],
        });
        console.log("✅ Settlement Verified");
    } catch (e) {
        if (e.message.includes("Already Verified")) {
            console.log("✅ Settlement Already Verified");
        } else {
            console.error("❌ Settlement Verification Failed:", e.message);
        }
    }

    console.log("\n2. Verifying MarketFactory...");
    try {
        await hre.run("verify:verify", {
            address: factoryAddress,
            constructorArguments: [
                usdcAddress,
                creationBond,
                deployerAddress,
                memeFactoryAddress
            ],
        });
        console.log("✅ MarketFactory Verified");
    } catch (e) {
        if (e.message.includes("Already Verified")) {
            console.log("✅ MarketFactory Already Verified");
        } else {
            console.error("❌ MarketFactory Verification Failed:", e.message);
        }
    }
}

main().catch(console.error);
