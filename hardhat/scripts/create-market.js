const hre = require("hardhat");

async function main() {
  console.log("\n=== 创建预测市场 ===\n");

  // 读取部署信息
  const fs = require("fs");
  const deploymentPath = "./deployments/" + hre.network.name + ".json";

  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ 未找到部署信息，请先运行部署脚本");
    console.log("   npx hardhat run scripts/deploy.js --network", hre.network.name);
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const factoryAddress = deployment.contracts.MarketFactory;
  const usdcAddress = deployment.contracts.MockUSDC;

  console.log("Factory 地址:", factoryAddress);
  console.log("USDC 地址:", usdcAddress, "\n");

  const [signer] = await ethers.getSigners();
  console.log("创建者:", signer.address);
  console.log("余额:", ethers.formatEther(await ethers.provider.getBalance(signer.address)), "ETH");

  // ==================== 创建市场参数 ====================
  const question = "比特币在 2025 年底能突破 $150,000?";
  const templateId = 0; // 0 = 二元选项 (YES/NO)
  const resolutionDays = 30; // 30 天后结算
  const initialYesPrice = ethers.parseEther("0.5"); // 初始 50%

  const resolutionTime = Math.floor(Date.now() / 1000) + (resolutionDays * 24 * 3600);
  const creationBond = ethers.parseEther("0.01"); // 0.01 ETH 保证金

  console.log("\n=== 市场参数 ===");
  console.log("问题:", question);
  console.log("模板 ID:", templateId, "(二元选项)");
  console.log("结算时间:", new Date(resolutionTime * 1000).toLocaleString());
  console.log("初始 YES 价格:", ethers.formatEther(initialYesPrice) * 100, "%");
  console.log("创建保证金:", ethers.formatEther(creationBond), "ETH");

  // ==================== 部署 Market 合约 ====================
  console.log("\n⏳ 创建市场...");

  const MarketFactory = await ethers.getContractFactory("MarketFactory");
  const factory = MarketFactory.attach(factoryAddress);

  // 发送交易
  const tx = await factory.createMarket(
    question,
    templateId,
    resolutionTime,
    initialYesPrice,
    { value: creationBond }
  );

  console.log("交易哈希:", tx.hash);
  console.log("等待确认...");

  const receipt = await tx.wait();
  console.log("✅ 交易已确认! Gas 用量:", receipt.gasUsed.toString());

  // ==================== 解析事件 ====================
  const event = receipt.logs.find(
    log => log.fragment?.name === "MarketCreated"
  );

  if (event) {
    const marketAddress = event.args.market;
    const creator = event.args.creator;
    const questionId = event.args.questionId;
    const paramsHash = event.args.paramsHash;

    console.log("\n=== 市场创建成功 ===");
    console.log("市场地址:", marketAddress);
    console.log("创建者:", creator);
    console.log("问题 ID:", questionId.toString());
    console.log("参数哈希:", paramsHash);

    // ==================== 获取市场信息 ====================
    const Market = await ethers.getContractFactory("Market");
    const market = Market.attach(marketAddress);

    const info = await market.getMarketInfo();

    console.log("\n=== 市场详细信息 ===");
    console.log("问题:", info.question);
    console.log("阶段:", info.stage.toString(), "(0=AMM, 1=Hybrid, 2=Orderbook)");
    console.log("状态:", info.status.toString(), "(0=Active, 1=Resolving, 2=Finalized)");
    console.log("YES 储备:", ethers.formatEther(info.yesReserve));
    console.log("NO 储备:", ethers.formatEther(info.noReserve));
    console.log("最新价格:", ethers.formatEther(info.latestPrice) * 100, "%");
    console.log("总交易量:", ethers.formatEther(info.totalVolume));
    console.log("独立交易者:", info.uniqueTraders.toString());

    // ==================== 获取价格 ====================
    const yesPrice = await market.getYesPrice();
    const noPrice = await market.getNoPrice();

    console.log("\n=== 当前价格 ===");
    console.log("YES 价格:", ethers.formatEther(yesPrice) * 100, "%");
    console.log("NO 价格:", ethers.formatEther(noPrice) * 100, "%");

    // ==================== 保存市场信息 ====================
    const marketData = {
      marketAddress: marketAddress,
      question: info.question,
      templateId: templateId,
      stage: info.stage.toString(),
      status: info.status.toString(),
      yesPrice: ethers.formatEther(yesPrice),
      noPrice: ethers.formatEther(noPrice),
      resolutionTime: new Date(resolutionTime * 1000).toISOString(),
    };

    const marketsPath = "./markets/" + hre.network.name + ".json";
    fs.mkdirSync("./markets", { recursive: true });

    let markets = [];
    if (fs.existsSync(marketsPath)) {
      markets = JSON.parse(fs.readFileSync(marketsPath, "utf8"));
    }
    markets.push(marketData);
    fs.writeFileSync(marketsPath, JSON.stringify(markets, null, 2));

    console.log("\n✅ 市场信息已保存到:", marketsPath);

    // ==================== 下一步 ====================
    console.log("\n💡 下一步操作:");
    console.log("1. 运行测试:");
    console.log(`   npx hardhat test --network ${hre.network.name}`);
    console.log("\n2. 测试交易:");
    console.log(`   npx hardhat run scripts/trade.js --network ${hre.network.name} --market ${marketAddress}\n`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
