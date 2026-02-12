const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Meme 概率协议 - 完整测试", function () {
  let usdc;
  let factory;
  let settlement;
  let owner;
  let user1;
  let user2;

  // 合约地址
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  before(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    console.log("\n=== 测试账户 ===");
    console.log("Owner:", owner.address);
    console.log("User1:", user1.address);
    console.log("User2:", user2.address);
  });

  describe("1. 部署合约", function () {
    it("应该部署 MockUSDC", async function () {
      const MockUSDC = await ethers.getContractFactory("MockUSDC");
      usdc = await MockUSDC.deploy();
      await usdc.waitForDeployment();

      const address = await usdc.getAddress();
      console.log("✅ MockUSDC 部署到:", address);

      expect(address).to.not.equal(ZERO_ADDRESS);
    });

    it("应该给测试账户分配 USDC", async function () {
      const amount = ethers.parseUnits("10000", 6); // 10000 USDC

      // 给 user1 和 user2 分配 USDC
      await usdc.connect(owner).faucet(amount);
      await usdc.connect(user1).faucet(amount);

      const balance1 = await usdc.balanceOf(user1.address);
      const balance2 = await usdc.balanceOf(user2.address);

      console.log("✅ User1 USDC 余额:", ethers.formatUnits(balance1, 6));
      console.log("✅ User2 USDC 余额:", ethers.formatUnits(balance2, 6));

      expect(balance1).to.be.greaterThan(0);
      expect(balance2).to.be.greaterThan(0);
    });

    it("应该部署 Settlement 合约", async function () {
      const Settlement = await ethers.getContractFactory("Settlement");
      settlement = await Settlement.deploy(await usdc.getAddress());
      await settlement.waitForDeployment();

      const address = await settlement.getAddress();
      console.log("✅ Settlement 部署到:", address);

      expect(address).to.not.equal(ZERO_ADDRESS);
    });

    it("应该部署 MarketFactory 合约", async function () {
      const MarketFactory = await ethers.getContractFactory("MarketFactory");

      // 创建保证金：0.01 ETH
      const creationBond = ethers.parseEther("0.01");

      factory = await MarketFactory.deploy(
        await usdc.getAddress(), // collateralToken
        creationBond,            // creationBond
        owner.address            // treasury
      );
      await factory.waitForDeployment();

      const address = await factory.getAddress();
      console.log("✅ MarketFactory 部署到:", address);
      console.log("   创建保证金:", ethers.formatEther(creationBond), "ETH");

      expect(address).to.not.equal(ZERO_ADDRESS);

      // 验证配置
      const storedBond = await factory.creationBond();
      expect(storedBond).to.equal(creationBond);
    });
  });

  describe("2. 创建市场", function () {
    let marketAddress;

    it("应该成功创建市场", async function () {
      const question = "比特币年底能突破 $100k?";
      const templateId = 0; // 二元选项
      const resolutionTime = Math.floor(Date.now() / 1000) + 7 * 24 * 3600; // 7天后
      const initialYesPrice = ethers.parseEther("0.5"); // 50%

      // 发送创建保证金
      const tx = await factory.connect(user1).createMarket(
        question,
        templateId,
        resolutionTime,
        initialYesPrice,
        { value: ethers.parseEther("0.01") }
      );

      const receipt = await tx.wait();

      // 从事件中解析市场地址
      const event = receipt.logs.find(
        log => log.fragment?.name === "MarketCreated"
      );

      marketAddress = event.args.market;
      console.log("✅ 市场创建成功:", marketAddress);
      console.log("   问题:", question);
      console.log("   模板 ID:", templateId);

      expect(marketAddress).to.not.equal(ZERO_ADDRESS);

      // 验证市场被记录
      const isMarket = await factory.isMarket(marketAddress);
      expect(isMarket).to.be.true;
    });

    it("应该获取市场列表", async function () {
      const markets = await factory.getMarkets();
      console.log("✅ 市场总数:", markets.length);
      console.log("   第一个市场:", markets[0]);

      expect(markets.length).to.be.greaterThan(0);
    });

    it("创建者余额应该减少（保证金被扣除）", async function () {
      const balance = await ethers.provider.getBalance(user1.address);
      console.log("✅ User1 ETH 余额:", ethers.formatEther(balance));

      // 余额应该小于 100 ETH (初始测试余额)
      expect(balance).to.be.lessThan(ethers.parseEther("100"));
    });
  });

  describe("3. AMM 交易", function () {
    let market;

    before(async function () {
      // 获取第一个市场
      const markets = await factory.getMarkets();
      const Market = await ethers.getContractFactory("Market");
      market = Market.attach(markets[0]);
    });

    it("应该获取市场信息", async function () {
      const info = await market.getMarketInfo();
      console.log("\n=== 市场信息 ===");
      console.log("问题:", info.question);
      console.log("阶段:", info.stage); // 0 = AMM
      console.log("状态:", info.status);
      console.log("YES 储备:", ethers.formatEther(info.yesReserve));
      console.log("NO 储备:", ethers.formatEther(info.noReserve));
      console.log("最新价格:", ethers.formatEther(info.latestPrice));
    });

    it("应该批准 USDC 并买入 YES", async function () {
      const amountIn = ethers.parseUnits("100", 6); // 100 USDC

      // 批准市场合约使用 USDC
      await usdc.connect(user1).approve(await market.getAddress(), amountIn);
      console.log("✅ 已批准", ethers.formatUnits(amountIn, 6), "USDC");

      // 买入 YES
      const tx = await market.connect(user1).buy(0, amountIn); // 0 = YES
      const receipt = await tx.wait();

      // 查找 Trade 事件
      const tradeEvent = receipt.logs.find(
        log => log.fragment?.name === "Trade"
      );

      console.log("✅ 买入 YES 成功!");
      console.log("   交易者:", tradeEvent.args.trader);
      console.log("   方向:", tradeEvent.args.side === 0n ? "YES" : "NO");
      console.log("   输入金额:", ethers.formatEther(tradeEvent.args.amountIn));
      console.log("   获得份额:", ethers.formatEther(tradeEvent.args.sharesOut));
      console.log("   价格:", ethers.formatEther(tradeEvent.args.price));

      expect(tradeEvent.args.trader).to.equal(user1.address);
    });

    it("应该查看用户持仓", async function () {
      const position = await market.getUserPosition(user1.address);
      console.log("\n=== User1 持仓 ===");
      console.log("YES 份额:", ethers.formatEther(position.yesAmount));
      console.log("NO 份额:", ethers.formatEther(position.noAmount));

      expect(position.yesAmount).to.be.greaterThan(0);
    });

    it("应该卖出 YES", async function () {
      const position = await market.getUserPosition(user1.address);
      const sellAmount = position.yesAmount / 2n; // 卖出一半

      const tx = await market.connect(user1).sell(0, sellAmount);
      const receipt = await tx.wait();

      const tradeEvent = receipt.logs.find(
        log => log.fragment?.name === "Trade"
      );

      console.log("✅ 卖出 YES 成功!");
      console.log("   卖出份额:", ethers.formatEther(sellAmount));
      console.log("   获得金额:", ethers.formatEther(tradeEvent.args.amountOut));

      expect(tradeEvent.args.trader).to.equal(user1.address);
    });
  });

  describe("4. 价格查询", function () {
    let market;

    before(async function () {
      const markets = await factory.getMarkets();
      const Market = await ethers.getContractFactory("Market");
      market = Market.attach(markets[0]);
    });

    it("应该获取当前 YES 价格", async function () {
      const price = await market.getYesPrice();
      console.log("✅ YES 价格:", ethers.formatEther(price) * 100, "%");
    });

    it("应该获取当前 NO 价格", async function () {
      const price = await market.getNoPrice();
      console.log("✅ NO 价格:", ethers.formatEther(price) * 100, "%");
    });

    it("应该预估交易输出", async function () {
      const amountIn = ethers.parseUnits("50", 6);

      const [sharesOut, price] = await market.getBuyOutcome(0, amountIn);

      console.log("\n=== 交易预估 ===");
      console.log("输入:", ethers.formatUnits(amountIn, 6), "USDC");
      console.log("预计份额:", ethers.formatEther(sharesOut));
      console.log("有效价格:", ethers.formatEther(price));

      expect(sharesOut).to.be.greaterThan(0);
    });
  });

  describe("5. 市场统计", function () {
    let market;

    before(async function () {
      const markets = await factory.getMarkets();
      const Market = await ethers.getContractFactory("Market");
      market = Market.attach(markets[0]);
    });

    it("应该显示市场统计", async function () {
      const info = await market.getMarketInfo();

      console.log("\n=== 市场统计 ===");
      console.log("总交易量:", ethers.formatEther(info.totalVolume));
      console.log("独立交易者:", info.uniqueTraders.toString());
      console.log("当前区块:", await ethers.provider.getBlockNumber());
    });
  });

  describe("6. 乐观结算", function () {
    let market;
    let marketAddress;

    before(async function () {
      const markets = await factory.getMarkets();
      marketAddress = markets[0];
      const Market = await ethers.getContractFactory("Market");
      market = Market.attach(marketAddress);
    });

    it("应该提交结算提案", async function () {
      const bond = ethers.parseUnits("100", 6); // 100 USDC bond

      // 批准 Settlement 使用 USDC
      await usdc.connect(user2).approve(await settlement.getAddress(), bond);

      // 提交结算：YES 赢
      const tx = await settlement.connect(user2).proposeSettlement(marketAddress, true);
      const receipt = await tx.wait();

      const event = receipt.logs.find(
        log => log.fragment?.name === "SettlementProposed"
      );

      console.log("\n=== 结算提案 ===");
      console.log("市场:", event.args.market);
      console.log("提议者:", event.args.proposer);
      console.log("结果:", event.args.result ? "YES" : "NO");
      console.log("保证金:", ethers.formatUnits(event.args.bond, 6), "USDC");
      console.log("挑战期:", new Date(Number(event.args.deadline) * 1000).toLocaleString());

      expect(event.args.market).to.equal(marketAddress);
    });

    it("应该获取结算状态", async function () {
      const status = await settlement.getSettlementStatus(marketAddress);

      console.log("\n=== 结算状态 ===");
      console.log("已提案:", status.proposed);
      console.log("结果:", status.result ? "YES" : "NO");
      console.log("提议者:", status.proposer);
      console.log("被挑战:", status.challenged);
      console.log("已最终化:", status.finalized);

      expect(status.proposed).to.be.true;
    });
  });
});
