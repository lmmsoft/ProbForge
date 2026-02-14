
const { expect } = require("chai");
const { ethers } = require("hardhat"); // Works via runner

describe("Settlement Logic with Mocks", function () {
    let settlement, marketFactory, mockMemeFactory, mockMemeCurve, mockUSDC;
    let owner, user1, user2;
    let creationBond;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        creationBond = ethers.parseEther("0.01");

        // 1. Deploy Mocks
        const MockMemeFactory = await ethers.getContractFactory("MockMemeFactory");
        mockMemeFactory = await MockMemeFactory.deploy();

        const MockMemeCurve = await ethers.getContractFactory("MockMemeCurve");
        mockMemeCurve = await MockMemeCurve.deploy();

        // Setup Mock Factory to point to Mock Curve
        // Assume Token Address is random for now
        await mockMemeFactory.setTokenCurve(owner.address, await mockMemeCurve.getAddress());
        await mockMemeFactory.setIsCurve(await mockMemeCurve.getAddress(), true);

        // Deploy Mock USDC
        const MockUSDC = await ethers.getContractFactory("MockUSDC");
        mockUSDC = await MockUSDC.deploy();

        // 2. Deploy Settlement
        const Settlement = await ethers.getContractFactory("Settlement");
        settlement = await Settlement.deploy(await mockMemeFactory.getAddress());

        // 3. Deploy MarketFactory
        const MarketFactory = await ethers.getContractFactory("MarketFactory");
        marketFactory = await MarketFactory.deploy(
            await mockUSDC.getAddress(),
            creationBond,
            owner.address,
            await mockMemeFactory.getAddress()
        );

        // Link Settlement
        await marketFactory.setSettlementContract(await settlement.getAddress());
    });

    it("Should settle GRADUATION market correctly", async function () {
        // Create Market
        const resolutionTime = Math.floor(Date.now() / 1000) + 3600;
        await marketFactory.createMarket(
            "Will it graduate?",
            0,
            resolutionTime,
            ethers.parseEther("0.5"),
            owner.address, // Token
            0, // GRADUATION
            0,
            { value: creationBond }
        );
        const marketAddr = (await marketFactory.getMarkets())[0];

        // Simulate Time
        await ethers.provider.send("evm_increaseTime", [3601]);
        await ethers.provider.send("evm_mine");

        // Set Curve Config: Not Graduated
        await mockMemeCurve.setGraduated(false);

        // Preview
        let [result, val] = await settlement.previewSettlement(marketAddr);
        expect(result).to.equal(false);

        // Settle
        await settlement.settle(marketAddr);

        // Check Market Result
        const Market = await ethers.getContractFactory("Market");
        const market = Market.attach(marketAddr);
        const info = await market.getMarketInfo();
        expect(info._finalResult).to.equal(false);
        expect(info._resolved).to.equal(true);

        // Set Curve Config: Graduated
        // Note: Can't settle again, so create new market
        await marketFactory.createMarket(
            "Will it graduate 2?",
            0,
            resolutionTime + 5000,
            ethers.parseEther("0.5"),
            owner.address, // Token
            0, // GRADUATION
            0,
            { value: creationBond }
        );
        const marketAddr2 = (await marketFactory.getMarkets())[1];

        await mockMemeCurve.setGraduated(true);
        await ethers.provider.send("evm_increaseTime", [5000]); // Advance more
        await ethers.provider.send("evm_mine");

        // Settle
        await settlement.settle(marketAddr2);
        const market2 = Market.attach(marketAddr2);
        const info2 = await market2.getMarketInfo();
        expect(info2._finalResult).to.equal(true);
    });

    it("Should revert if curve is invalid", async function () {
        // Set isCurve to false
        await mockMemeFactory.setIsCurve(await mockMemeCurve.getAddress(), false);

        const resolutionTime = Math.floor(Date.now() / 1000) + 3600;
        await marketFactory.createMarket(
            "Invalid Curve Market",
            0,
            resolutionTime,
            ethers.parseEther("0.5"),
            owner.address,
            0,
            0,
            { value: creationBond }
        );
        const marketAddr = (await marketFactory.getMarkets())[0];

        await ethers.provider.send("evm_increaseTime", [3601]);
        await ethers.provider.send("evm_mine");

        await expect(settlement.settle(marketAddr)).to.be.revertedWith("INVALID_CURVE");
    });
});
