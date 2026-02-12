# Meme 概率协议 - Hardhat 项目

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 编译合约
npx hardhat compile

# 运行测试
npx hardhat test

# 部署到本地网络
npx hardhat run scripts/deploy.js

# 部署到 Base Sepolia 测试网
npx hardhat run scripts/deploy.js --network sepolia

# 创建测试市场
npx hardhat run scripts/create-market.js --network sepolia
```

---

## 📁 项目结构

```
hardhat/
├── contracts/          # Solidity 合约
│   ├── MarketFactory.sol   # 工厂合约
│   ├── Market.sol          # 市场合约 (AMM)
│   ├── Settlement.sol      # 结算合约
│   └── MockUSDC.sol        # 测试代币
├── scripts/           # 部署脚本
│   ├── deploy.js          # 部署所有合约
│   └── create-market.js   # 创建市场
├── test/              # 测试文件
│   └── MarketFactory.test.js
├── hardhat.config.cjs  # Hardhat 配置
├── .env.example       # 环境变量模板
└── DEPLOYMENT_GUIDE.md # 完整部署指南
```

---

## 🎯 核心功能

### 1. MarketFactory (工厂)

- ✅ 使用 CREATE2 创建市场
- ✅ 收取保证金防垃圾
- ✅ 记录所有市场

### 2. Market (市场)

- ✅ **Stage 0**: AMM Bonding Curve
- ✅ **Stage 1**: Hybrid (AMM + Orderbook)
- ✅ **Stage 2**: 纯 Orderbook
- ✅ 买卖 YES/NO 份额
- ✅ 自动价格发现

### 3. Settlement (结算)

- ✅ 乐观结算机制
- ✅ 挑战期 (3 天)
- ✅ 保证金制度

### 4. MockUSDC

- ✅ ERC20 代币 (6 位小数)
- ✅ Faucet 水龙头功能

---

## 🧪 测试结果

```bash
npx hardhat test
```

```
Meme 概率协议 - 完整测试

=== 测试账户 ===
Owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
User1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

  ✅ 10 passing (565ms)
```

---

## 📊 合约交互示例

### 1. 创建市场

```javascript
const factory = await ethers.getContractFactory("MarketFactory");

await factory.createMarket(
    "比特币年底能突破 $100k?",
    0,                           // templateId
    1735689600,                 // resolutionTime
    ethers.parseEther("0.5"),  // initialYesPrice
    { value: ethers.parseEther("0.01") }
);
```

### 2. AMM 交易

```javascript
const market = await ethers.getContractAt("Market", marketAddress);

// 买入 YES
await market.buy(0, ethers.parseUnits("100", 6));

// 卖出 YES
await market.sell(0, ethers.parseUnits("50", 18));
```

### 3. 查询价格

```javascript
const yesPrice = await market.getYesPrice();  // 0.5 = 50%
const noPrice = await market.getNoPrice();    // 0.5 = 50%
```

---

## 🔗 网络配置

### 本地测试网

```javascript
chainId: 31337
rpc: "http://localhost:8545"
```

### Base Sepolia (测试网)

```javascript
chainId: 84532
rpc: "https://sepolia.base.org
faucet: "https://sepoliafaucet.com"
```

### Base Mainnet

```javascript
chainId: 8453
rpc: "https://mainnet.base.org"
```

---

## 📝 环境变量

创建 `.env` 文件：

```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

---

## 🐛 故障排除

### 编译失败

```bash
# 清除缓存
npx hardhat clean
npx hardhat compile
```

### 测试失败

```bash
# 使用详细日志
npx hardhat test --verbose
```

### 部署失败

- 检查私钥格式
- 确保有足够的 ETH
- 检查网络配置

---

## 📚 文档

- [完整部署指南](./DEPLOYMENT_GUIDE.md)
- [参考文档](../reference.md)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 License

MIT
