const hre = require("hardhat");

async function main() {
    console.log("Hardhat loaded via node!");
    console.log("Network:", hre.network.name);
}

main().catch(console.error);
