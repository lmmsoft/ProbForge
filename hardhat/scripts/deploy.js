const hre = require("hardhat");

async function main() {
  console.log("\n=== 开始部署 Meme 概率协议合约 ===\n");

  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);
  console.log("账户余额:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // ==================== 1. 部署 MockUSDC ====================
  console.log("📦 1/4 部署 MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("✅ MockUSDC 部署到:", usdcAddress);

  // 给部署者铸造一些测试币
  await usdc.faucet(ethers.parseUnits("100000", 6));
  console.log("   已铸造 100,000 USDC 给部署者\n");

  // ==================== 2. 部署 Settlement ====================
  console.log("📦 2/4 部署 Settlement...");
  const Settlement = await ethers.getContractFactory("Settlement");
  const settlement = await Settlement.deploy(usdcAddress);
  await settlement.waitForDeployment();
  const settlementAddress = await settlement.getAddress();
  console.log("✅ Settlement 部署到:", settlementAddress);
  console.log("   保证金要求:", ethers.formatUnits(await settlement.minBond(), 6), "USDC");
  console.log("   挑战期:", (await settlement.challengePeriod()).toString(), "秒\n");

  // ==================== 3. 部署 MarketFactory ====================
  console.log("📦 3/4 部署 MarketFactory...");
  const MarketFactory = await ethers.getContractFactory("MarketFactory");

  // 参数：
  // - collateralToken: USDC 地址
  // - creationBond: 创建保证金 (0.01 ETH)
  // - treasury: 财库地址（接收保证金）
  const creationBond = ethers.parseEther("0.01"); // 0.01 ETH

  const factory = await MarketFactory.deploy(
    usdcAddress,
    creationBond,
    deployer.address // treasury
  );
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("✅ MarketFactory 部署到:", factoryAddress);
  console.log("   抵押代币:", usdcAddress);
  console.log("   创建保证金:", ethers.formatEther(creationBond), "ETH");
  console.log("   财库地址:", deployer.address, "\n");

  // ==================== 4. 部署配置验证 ====================
  console.log("🔍 4/4 验证部署配置...");

  // 验证 Factory 配置
  const storedBond = await factory.creationBond();
  const storedTreasury = await factory.treasury();
  const storedCollateral = await factory.collateralToken();

  console.log("✅ Factory 配置验证:");
  console.log("   创建保证金:", ethers.formatEther(storedBond), "ETH");
  console.log("   财库:", storedTreasury);
  console.log("   抵押代币:", storedCollateral);

  // 验证所有权
  const factoryOwner = await factory.owner();
  console.log("   所有者:", factoryOwner, "\n");

  // ==================== 部署总结 ====================
  console.log("\n=== 部署完成 ===");
  console.log("网络:", hre.network.name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId.toString());
  console.log("\n合约地址:");
  console.log("─────────────────────────────────────────────────────────");
  console.log("MockUSDC:     ", usdcAddress);
  console.log("Settlement:   ", settlementAddress);
  console.log("MarketFactory:", factoryAddress);
  console.log("─────────────────────────────────────────────────────────\n");

  // ==================== 保存部署信息 ====================
  const deployment = {
    network: hre.network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      MockUSDC: usdcAddress,
      Settlement: settlementAddress,
      MarketFactory: factoryAddress,
    },
    deploymentTime: new Date().toISOString(),
  };

  // 保存到文件
  const fs = require("fs");
  const deploymentPath = "./deployments/" + hre.network.name + ".json";
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
  console.log("✅ 部署信息已保存到:", deploymentPath, "\n");

  // ==================== 创建示例市场 ====================
  console.log("💡 提示: 现在你可以创建测试市场");
  console.log("   示例命令:");
  console.log(`   npx hardhat run scripts/create-market.js --network ${hre.network.name}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
