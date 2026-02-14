const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("\n=== 开始部署 Meme 概率协议合约 ===\n");

  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);
  console.log("账户余额:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  const networkName = hre.network.name;
  console.log("当前网络:", networkName);

  // Default addresses (Local/Testnet)
  let usdcAddress;
  let memeFactoryAddress;

  // ==================== 1. 配置/部署 依赖合约 ====================
  if (networkName === "mainnet" || networkName === "base") {
    // Base Mainnet Addresses
    console.log("🚀 检测到 Base 主网部署");
    usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Official USDC
    memeFactoryAddress = "0x07DFAEC8e182C5eF79844ADc70708C1c15aA60fb"; // Meme Factory
    console.log("   使用真实 USDC:", usdcAddress);
    console.log("   使用 Meme Factory:", memeFactoryAddress);
  } else {
    // Local/Testnet: Deploy Mock
    console.log("📦 1/4 部署环境依赖 (Mock)...");

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();
    usdcAddress = await usdc.getAddress();
    console.log("✅ MockUSDC 部署到:", usdcAddress);

    // Give deployer some USDC
    await usdc.faucet(ethers.parseUnits("100000", 6));
    console.log("   已铸造 100,000 USDC 给部署者");

    // Mock Meme Factory (Use deployer address as placeholder if not testing integration)
    // In a real testnet scenario, you might want to deploy a MockFactory. 
    // For now, we use a random address or deployer if just ensuring deployment works.
    memeFactoryAddress = deployer.address;
    console.log("   使用模拟 Meme Factory (Deployer):", memeFactoryAddress, "\n");
  }

  // ==================== 2. 部署 Settlement ====================
  console.log("📦 2/4 部署 Settlement...");
  const Settlement = await ethers.getContractFactory("Settlement");
  // Constructor: consumer of memeFactory
  const settlement = await Settlement.deploy(memeFactoryAddress);
  await settlement.waitForDeployment();
  const settlementAddress = await settlement.getAddress();
  console.log("✅ Settlement 部署到:", settlementAddress);

  // ==================== 3. 部署 MarketFactory ====================
  console.log("📦 3/4 部署 MarketFactory...");
  const MarketFactory = await ethers.getContractFactory("MarketFactory");

  // 参数：
  // - collateralToken: USDC 地址
  // - creationBond: 创建保证金 (0.01 ETH)
  // - treasury: 财库地址（接收保证金）
  // - memeFactory: Meme 平台工厂地址
  const creationBond = ethers.parseEther("0.01"); // 0.01 ETH

  const factory = await MarketFactory.deploy(
    usdcAddress,
    creationBond,
    deployer.address, // treasury
    memeFactoryAddress
  );
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("✅ MarketFactory 部署到:", factoryAddress);
  console.log("   抵押代币:", usdcAddress);
  console.log("   创建保证金:", ethers.formatEther(creationBond), "ETH");
  console.log("   财库地址:", deployer.address);
  console.log("   Meme Factory:", memeFactoryAddress, "\n");

  // ==================== 4. 配置连接 ====================
  console.log("🔗 4/4 配置合约连接...");

  // Set Settlement contract in Factory
  console.log("   设置 Factory 的 Settlement 合约...");
  const tx = await factory.setSettlementContract(settlementAddress);
  await tx.wait();
  console.log("✅ Settlement 合约已设置");

  // ==================== 部署总结 ====================
  console.log("\n=== 部署完成 ===");
  console.log("网络:", networkName);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId.toString());
  console.log("\n合约地址:");
  console.log("─────────────────────────────────────────────────────────");
  console.log("USDC:         ", usdcAddress);
  console.log("MemeFactory:  ", memeFactoryAddress);
  console.log("Settlement:   ", settlementAddress);
  console.log("MarketFactory:", factoryAddress);
  console.log("─────────────────────────────────────────────────────────\n");

  // ==================== 保存部署信息 ====================
  const deployment = {
    network: networkName,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      USDC: usdcAddress,
      MemeFactory: memeFactoryAddress,
      Settlement: settlementAddress,
      MarketFactory: factoryAddress,
    },
    deploymentTime: new Date().toISOString(),
  };

  // 保存到文件
  const fs = require("fs");
  const deploymentPath = "./deployments/" + networkName + ".json";
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  console.log("✅ 部署信息已保存到:", deploymentPath, "\n");

  if (networkName === "mainnet" || networkName === "base") {
    console.log("📋 验证合约指令:");
    console.log(`npx hardhat verify --network ${networkName} ${settlementAddress} ${memeFactoryAddress}`);
    console.log(`npx hardhat verify --network ${networkName} ${factoryAddress} ${usdcAddress} ${creationBond} ${deployer.address} ${memeFactoryAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
