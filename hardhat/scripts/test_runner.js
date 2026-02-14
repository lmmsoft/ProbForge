const hre = require("hardhat");

async function main() {
    console.log("Running tests...");
    await hre.run("test", { testFiles: ["test/Settlement.test.js"] });
}

main().catch(console.error);
