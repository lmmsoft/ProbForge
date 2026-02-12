# 结算模式修改总结

## 修改概述

将预测市场从 **Challenge 乐观结算模式** 改为 **直接读取 Meme 平台链上数据结算**。

---

## 新增文件

### 1. `contracts/IMemeCurve.sol`
Meme 平台曲线合约接口，用于读取链上数据。

```solidity
interface IMemeCurve {
    function getCurrentPrice() external view returns (uint256);
    function getMarketCap() external view returns (uint256);
    function graduated() external view returns (bool);
    function getGraduationInfo() external view returns (...);
    function token() external view returns (address);
}
```

### 2. `contracts/IMemeFactory.sol`
Meme 平台工厂合约接口。

```solidity
interface IMemeFactory {
    function tokenToCurve(address token) external view returns (address);
}
```

---

## 修改文件

### 1. `contracts/Settlement.sol`
**完全重写**，移除乐观结算逻辑。

| 移除 | 新增 |
|-------|-------|
| `SettlementProposal` 结构体 | `SettlementType` 枚举 (0/1/2) |
| `proposals` 映射 | `memeFactory` 地址 |
| `challengePeriod` | `settle()` 函数直接读取链上数据 |
| `minBond` | `previewSettlement()` 预览函数 |
| `proposeSettlement()` | - |
| `challengeSettlement()` | - |
| `finalizeSettlement()` | - |

**新结算逻辑**：
```solidity
function settle(address market) external {
    // 1. 读取市场配置
    (address curve, SettlementType settleType, uint256 targetValue, ) = IMarket(market).getSettlementInfo();

    // 2. 检查时间
    require(block.timestamp >= resolutionTime, "NOT_YET_RESOLVABLE");

    // 3. 读取 Meme 平台数据并判定结果
    result = _determineResult(curve, settleType, targetValue);

    // 4. 执行结算
    IMarket(market).resolve(result);
}
```

---

### 2. `contracts/Market.sol`
添加结算相关状态变量和函数。

**新增状态变量**：
```solidity
address public targetCurve;         // Meme 平台曲线地址
address public targetToken;          // Meme 代币地址
uint8 public settleType;            // 0=毕业, 1=市值>=X, 2=市值<X
uint256 public targetValue;          // 目标值
bool public resolved;                // 是否已结算
bool public finalResult;            // 最终结果
```

**新增函数**：
- `resolve(bool result)` - 结算市场
- `claimWinnings()` - 赢家提取奖励
- `getSettlementInfo()` - 获取结算信息
- `setTargetCurve(address)` - 设置曲线地址

**修改构造函数**：
- 新增 `_targetToken` 参数
- 新增 `_settleType` 参数
- 新增 `_targetValue` 参数

---

### 3. `contracts/MarketFactory.sol`
修改工厂合约以支持新的结算机制。

**新增状态变量**：
```solidity
address public settlementContract;  // Settlement 合约地址
address public memeFactory;         // Meme 平台工厂地址 (0x07DF...60fb)
```

**修改 `createMarket()` 函数**：
新增参数：
- `targetToken` - Meme 代币地址
- `settleType` - 结算类型 (0/1/2)
- `targetValue` - 目标值

**新增逻辑**：
```solidity
// 通过 Meme Factory 获取曲线地址
address curveAddress = IMemeFactory(memeFactory).tokenToCurve(targetToken);
require(curveAddress != address(0), "CURVE_NOT_FOUND");

// 部署后设置曲线地址
Market(market).setTargetCurve(curveAddress);
```

**新增管理函数**：
- `setSettlementContract(address)` - 设置结算合约
- `setMemeFactory(address)` - 更新 Meme Factory 地址

---

### 4. `contracts/script/Deploy.s.sol`
更新部署脚本。

**Base 主网地址**：
```solidity
address constant MEME_FACTORY = 0x07DFAEC8e182C5eF79844ADc70708C1c15aA60fb;
```

**部署流程**：
1. 部署 MockUSDC（或使用真实 USDC）
2. 部署 Settlement（传入 Meme Factory 地址）
3. 部署 MarketFactory（传入 Meme Factory 地址）
4. 设置 Settlement 合约到 Factory
5. 转移 USDC 到 Factory

---

## 结算类型说明

| Type | 值 | 描述 | 结算逻辑 |
|-------|-----|------|----------|
| GRADUATION | 0 | 是否毕业 | `graduated() == true` → YES 赢 |
| MARKET_CAP_GE | 1 | 市值 >= X | `getMarketCap() >= targetValue` → YES 赢 |
| MARKET_CAP_LT | 2 | 市值 < X | `getMarketCap() < targetValue` → YES 赢 |

---

## 创建市场示例

### 场景 1：毕业预测
```solidity
factory.createMarket(
    "Token X 会在 7 天内毕业吗？",
    0,              // templateId
    block.timestamp + 7 days,
    0.5e18,         // 初始 YES 价格 50%
    0xTokenAddress,   // 目标代币地址
    0,               // settleType = GRADUATION
    0                // targetValue (毕业预测不需要)
);
```

### 场景 2：市值预测
```solidity
factory.createMarket(
    "Token X 市值会达到 100 ETH 吗？",
    0,
    block.timestamp + 7 days,
    0.3e18,         // 初始 YES 价格 30%
    0xTokenAddress,
    1,               // settleType = MARKET_CAP_GE
    100e18           // targetValue = 100 ETH
);
```

### 场景 3：市值上限预测
```solidity
factory.createMarket(
    "Token X 市值会低于 50 ETH 吗？",
    0,
    block.timestamp + 7 days,
    0.7e18,         // 初始 YES 价格 70%
    0xTokenAddress,
    2,               // settleType = MARKET_CAP_LT
    50e18            // targetValue = 50 ETH
);
```

---

## 结算流程

### 触发结算
任何人都可以在到达 `resolutionTime` 后调用：

```solidity
settlement.settle(marketAddress);
```

### 结算执行
1. Settlement 读取市场的结算配置
2. 检查是否到达结算时间
3. 调用 Meme 平台合约读取链上数据
4. 根据结算类型判定 YES/NO
5. 调用 Market 的 `resolve(result)` 函数
6. 用户调用 `claimWinnings()` 提取奖励

### 赢家提取
```solidity
market.claimWinnings();
// YES 赢：YES 份额 1:1 赎回
// NO 赢：NO 份额 1:1 赎回
```

---

## 关键常量（Base 主网）

```solidity
// Meme 平台工厂地址
MEME_FACTORY = 0x07DFAEC8e182C5eF79844ADc70708C1c15aA60fb

// Aerodrome DEX（毕业后代币迁移至此）
AERODROME_ROUTER = 0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43

// Base 主网 Chain ID
CHAIN_ID = 8453
```

---

## 部署命令

```bash
# 设置私钥
export PRIVATE_KEY=your_private_key

# 部署到 Base 主网
forge script script/Deploy.s.sol:DeployScript --rpc-url base --broadcast

# 或使用 Hardhat
npx hardhat run scripts/deploy.js --network base
```

---

## 安全注意事项

1. **Meme Factory 地址必须正确**：错误的地址会导致 `tokenToCurve()` 返回 0 地址
2. **结算时间锁定**：未到达 `resolutionTime` 无法结算
3. **权限控制**：
   - `resolve()` 只能由 Settlement 合约调用
   - `setTargetCurve()` 只能由 Factory 调用
4. **曲线地址验证**：创建市场时检查曲线是否存在

---

## 文件同步

以下文件已同步到 `hardhat/contracts/` 目录：
- `IMemeCurve.sol`
- `IMemeFactory.sol`
- `Market.sol`
- `MarketFactory.sol`
- `Settlement.sol`

使用 `npx hardhat compile` 验证编译通过。
