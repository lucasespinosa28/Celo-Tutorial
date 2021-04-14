const { expect } = require("chai");

describe("TinyVillage Test", function() {
    it("Should mint village", async function() {
        const accounts = await ethers.getSigners();

        const TinyVillage = await ethers.getContractFactory("TinyVillage");
        const tinyVillage = await TinyVillage.deploy();

        await tinyVillage.mintVillage();
        const balance = await tinyVillage.balanceOf(accounts[0].address,0)
        expect(1).to.equal(Number(balance.toString()));
    });

    it("Should mint castle",async function () {
        const accounts = await ethers.getSigners();

        const TinyVillage = await ethers.getContractFactory("TinyVillage");
        const tinyVillage = await TinyVillage.deploy();

        await tinyVillage.mintVillage();
        await tinyVillage.mintMine();
        await tinyVillage.mintFarm();
        await tinyVillage.mintMill();
        await tinyVillage.mintCastle();
        const balance = await tinyVillage.balanceOf(accounts[0].address, 4)
        expect(1).to.equal(Number(balance.toString()));
    });
});