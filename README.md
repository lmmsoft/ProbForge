# Meme 概率协议 - 完整实现

## 📋 项目概述

去中心化预测市场协议，支持三阶段自适应市场机制（AMM → Hybrid → Orderbook）。

### 核心特性

- ✅ **AMM 冷启动**: 使用 Bonding Curve 提供流动性
- ✅ **三阶段演进**: Stage 0 (AMM) → Stage 1 (Hybrid) → Stage 2 (Orderbook)
- ✅ **SIWE 认证**: Sign-In with Ethereum 去中心化登录
- ✅ **WebSocket 实时通信**: 实时价格和事件推送
- ✅ **审计日志**: 完整的用户操作记录
- ✅ **乐观结算**: 提交-挑战机制

---

## 🏗️ 项目结构

```
/Users/a1/hack/
├── contracts/              # Solidity 智能合约
│   ├── MarketFactory.sol   # 工厂合约
│   ├── Market.sol          # 市场合约 (AMM)
│   ├── Settlement.sol      # 结算合约
│   ├── MockUSDC.sol        # 测试代币
│   ├── script/
│   │   └── Deploy.s.sol    # 部署脚本
│   └── foundry.toml        # Foundry 配置
├── dist/                   # 部署目录
│   └── index.html          # 完整 Demo 页面
├── demo-complete.html      # 完整 Demo 源码
├── reference.md            # 技术文档
└── README.md               # 本文件
```

---

## 🚀 快速开始

### 1. 部署智能合约（可选）

```bash
# 安装 Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 初始化项目
forge init

# 复制合约到 src/ 目录
cp contracts/*.sol src/

# 编译
forge build

# 部署到 Base Sepolia
export PRIVATE_KEY=your_private_key
forge script script/Deploy.s.sol:DeployScript --rpc-url base_sepolia --broadcast
```

### 2. 访问 Demo

**部署地址**: https://a0104911.meme-probability-demo.pages.dev

---

## 💼 功能说明

### 1. 钱包连接

- 支持 MetaMask、Rabby、WalletConnect 等
- 自动检测网络并提示切换到 Base Sepolia
- 显示 ETH 和 USDC 余额

### 2. SIWE 认证

- 基于以太坊签名的去中心化登录
- 生成符合 SIWE 标准的消息
- 验证签名并记录审计日志

### 3. 创建市场

- 支持二元选项（YES/NO）
- 设置初始价格和结算时间
- 支付保证金防垃圾

### 4. AMM 交易

- 基于 Bonding Curve 的自动定价
- 实时价格预估
- 0.3% 交易手续费

### 5. WebSocket 实时通信

- 监听新区块
- 实时价格更新
- 事件推送

### 6. 审计日志

- 记录所有用户操作
- 存储到 localStorage
- 支持导出

---

## 🔧 配置

### 环境变量

```bash
# Base Sepolia 测试网
CHAIN_ID=84532
RPC_URL=https://sepolia.base.org
WS_URL=wss://sepolia.base.org

# 合约地址（部署后填入）
FACTORY_ADDRESS=
USDC_ADDRESS=0x036CbD53842c5426634e7929541eA2318763Ec45

# 后端 API（如果需要）
API_BASE_URL=http://localhost:3000
JWT_SECRET=
```

---

## 📱 使用流程

1. **连接钱包**
   - 点击"连接钱包"按钮
   - 在 MetaMask 中确认连接
   - 检查网络是否为 Base Sepolia

2. **SIWE 认证**（可选但推荐）
   - 点击"SIWE 签名认证"
   - 在钱包中签名消息
   - 完成身份验证

3. **创建市场**
   - 填写问题描述
   - 选择模板类型
   - 设置初始价格和结算时间
   - 支付保证金创建

4. **交易**
   - 从市场列表选择市场
   - 选择买入 YES 或 NO
   - 输入交易金额
   - 执行交易

5. **查看持仓**
   - 实时查看 YES/NO 份额
   - 计算总价值

---

## 🧪 测试

### 获取测试币

- **ETH**: https://sepoliafaucet.com
- **USDC**: 使用 MockUSDC 合约的 `faucet()` 函数

### 运行测试

```bash
# 合约测试
forge test

# 前端测试
# 直接访问部署的 URL 进行手动测试
```

---

## 🔐 安全说明

### 智能合约

- 使用 OpenZeppelin 的安全库
- ReentrancyGuard 防重入
- Pausable 紧急暂停
- SafeERC20 安全转账

### 前端

- 所有签名在客户端完成
- 私钥永不离开钱包
- 审计日志本地存储（生产环境应发送到后端）

---

## 📊 技术栈

| 层级 | 技术 |
|------|------|
| **智能合约** | Solidity 0.8.20, Foundry |
| **前端** | Vanilla JS, Ethers.js v6 |
| **认证** | SIWE (Sign-In with Ethereum) |
| **实时通信** | WebSocket |
| **部署** | Cloudflare Pages |
| **测试网** | Base Sepolia |

---

## 🛣️ 开发路线图

### MVP (当前)

- ✅ 基础 AMM 交易
- ✅ 市场创建
- ✅ SIWE 认证
- ✅ WebSocket 实时更新

### 短期

- [ ] 链下订单簿
- [ ] 后端 API (Express + MySQL)
- [ ] 事件索引器
- [ ] 完整的结算流程

### 长期

- [ ] Stage 1/2 实现
- [ ] 做市商激励
- [ ] 移动端支持
- [ ] 多链部署

---

## 📚 参考文档

- [reference.md](./reference.md) - 完整技术文档
- [SIWE 标准](https://login.xyz/)
- [Ethers.js 文档](https://docs.ethers.org/)
- [Foundry 文档](https://book.getfoundry.sh/)

---

## 🙏 致谢

本项目参考了以下项目的设计：

- Polymarket - 预测市场机制
- Uniswap - AMM 算法
- Gnosis Conditional Tokens - 条件代币

---

## 📄 License

MIT License

---

## 🆘 支持

如有问题，请创建 Issue 或联系开发团队。

**Demo URL**: https://a0104911.meme-probability-demo.pages.dev
