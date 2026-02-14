
const { ethers } = require("ethers");

async function main() {
    console.log("=== Checking Data on Base Mainnet ===");

    // Connect to Base Mainnet
    const RPC_URL = "https://mainnet.base.org";
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const MEME_FACTORY_ADDRESS = "0x07DFAEC8e182C5eF79844ADc70708C1c15aA60fb";
    const TOKEN_ADDRESS = "0xcc095d17f3035e768ea88168382def86ca6bf808";

    // ABI subset
    const ABI = [
        "function tokenToCurve(address token) view returns (address)",
        "function isCurve(address curve) view returns (bool)"
    ];

    const factory = new ethers.Contract(MEME_FACTORY_ADDRESS, ABI, provider);

    console.log(`Factory: ${MEME_FACTORY_ADDRESS}`);
    console.log(`Token: ${TOKEN_ADDRESS}`);

    try {
        const curve = await factory.tokenToCurve(TOKEN_ADDRESS);
        console.log(`Curve: ${curve}`);

        if (curve === ethers.ZeroAddress) {
            console.error("❌ Token maps to zero address!");
        } else {
            console.log("✅ Token maps to a curve.");

            const isCurve = await factory.isCurve(curve);
            console.log(`isCurve(${curve}): ${isCurve}`);

            if (isCurve) {
                console.log("✅ Curve is valid according to Factory.");
            } else {
                console.error("❌ Curve is NOT valid according to Factory.");
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

main().catch(console.error);
