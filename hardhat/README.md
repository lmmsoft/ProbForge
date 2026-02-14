# Meme Probability Protocol - Hardhat Project

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deploy.js

# Deploy to Base Sepolia Testnet
npx hardhat run scripts/deploy.js --network sepolia

# Create a test market
npx hardhat run scripts/create-market.js --network sepolia
```

---

## 📁 Project Structure

```
hardhat/
├── contracts/          # Solidity Contracts
│   ├── MarketFactory.sol   # Factory Contract
│   ├── Market.sol          # Market Contract (AMM + Orderbook)
│   ├── Settlement.sol      # Settlement Contract
│   └── MockUSDC.sol        # Test Token
├── scripts/           # Deployment Scripts
│   ├── deploy.js          # Deploy all contracts
│   └── create-market.js   # Create a new market
├── test/              # Tests
│   └── MarketFactory.test.js
├── hardhat.config.cjs  # Hardhat Configuration
├── .env.example       # Environment Variables Template
└── DEPLOYMENT_GUIDE.md # Full Deployment Guide
```

---

## 🎯 Core Features

### 1. MarketFactory

- ✅ Create markets using CREATE2
- ✅ Anti-spam deposit mechanism
- ✅ Registry of all markets

### 2. Market

- ✅ **Stage 0**: AMM Bonding Curve
- ✅ **Stage 1**: Hybrid (AMM + Orderbook)
- ✅ **Stage 2**: Pure Orderbook
- ✅ Buy/Sell YES/NO shares
- ✅ Automatic price discovery

### 3. Settlement

- ✅ **On-Chain Automatic Settlement**: Markets settle automatically based on on-chain data verification.
- ✅ No manual intervention required.
- ✅ Secure and transparent resolution logic.

### 4. MockUSDC

- ✅ ERC20 Token (6 decimals)
- ✅ Faucet functionality for testing

---

## 🧪 Test Results

```bash
npx hardhat test
```

```
Meme Probability Protocol - Full Test Suite

=== Test Accounts ===
Owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
User1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

  ✅ 10 passing (565ms)
```

---

## 📊 Contract Interactions

### 1. Create Market

```javascript
const factory = await ethers.getContractFactory("MarketFactory");

await factory.createMarket(
    "Will Bitcoin break $100k by year end?",
    0,                           // templateId
    1735689600,                 // resolutionTime
    ethers.parseEther("0.5"),  // initialYesPrice
    { value: ethers.parseEther("0.01") }
);
```

### 2. AMM Trading

```javascript
const market = await ethers.getContractAt("Market", marketAddress);

// Buy YES shares
await market.buy(0, ethers.parseUnits("100", 6));

// Sell YES shares
await market.sell(0, ethers.parseUnits("50", 18));
```

### 3. Query Price

```javascript
const yesPrice = await market.getYesPrice();  // 0.5 = 50%
const noPrice = await market.getNoPrice();    // 0.5 = 50%
```

---

## 🔗 Network Configuration

### Local Network

```javascript
chainId: 31337
rpc: "http://localhost:8545"
```

### Base Sepolia (Testnet)

```javascript
chainId: 84532
rpc: "https://sepolia.base.org"
faucet: "https://sepoliafaucet.com"
```

### Base Mainnet

```javascript
chainId: 8453
rpc: "https://mainnet.base.org"
```

---

## 📝 Environment Variables

Create a `.env` file:

```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

---

## 🐛 Troubleshooting

### Compilation Errors

```bash
# Clear cache
npx hardhat clean
npx hardhat compile
```

### Test Failures

```bash
# Verbose logging
npx hardhat test --verbose
```

### Deployment Failures

- Check private key format
- Ensure sufficient ETH balance
- Verify network configuration

---

## 📚 Documentation

- [Full Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Reference Documentation](../reference.md)

---

## 🤝 Contributing

Issues and Pull Requests are welcome!

---

## 📄 License

MIT
