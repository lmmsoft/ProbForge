
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../.env");

try {
    const content = fs.readFileSync(envPath, "utf8");
    console.log("File size:", content.length);

    const lines = content.split("\n");
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("#") || trimmed.length === 0) return;

        const [key, ...values] = trimmed.split("=");
        const value = values.join("=");

        if (key === "PRIVATE_KEY") {
            console.log(`Line ${index + 1}: PRIVATE_KEY found. Value length: ${value ? value.length : 0}`);
        } else if (key === "BASE_MAINNET_RPC") {
            console.log(`Line ${index + 1}: BASE_MAINNET_RPC found.`);
        } else {
            console.log(`Line ${index + 1}: Key '${key}' found.`);
        }
    });

    if (content.length === 0) {
        console.log("WARNING: .env file is empty!");
    }
} catch (error) {
    console.error("Error reading .env:", error.message);
}
