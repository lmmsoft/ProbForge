
require("dotenv").config();

console.log("Checking environment variables...");
console.log("Current Directory:", process.cwd());

const pk = process.env.PRIVATE_KEY;
if (pk) {
    console.log("PRIVATE_KEY: FOUND");
    console.log("Length:", pk.length);
    console.log("Starts with 0x:", pk.startsWith("0x"));
} else {
    console.log("PRIVATE_KEY: MISSING");
}

const rpc = process.env.BASE_MAINNET_RPC;
console.log("BASE_MAINNET_RPC:", rpc || "MISSING");
