const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Wrap", function () {
  it("should wrap tokenA into tokenB", async function () {
    const [owner, acc1,] = await ethers.getSigners();
    const TokenA = await ethers.getContractFactory("TokenA");
    const tokenA = await TokenA.deploy(1000);
    const TokenB = await ethers.getContractFactory("TokenB");
    const tokenB = await TokenB.deploy(100);

    await Promise.all([tokenA.deployed(), tokenB.deployed()])

    const Wrap = await ethers.getContractFactory("Wrap");
    const wrapContract = await Wrap.deploy(tokenA.address);

    await wrapContract.deployed()

    await tokenB.transfer(wrapContract.address, 60);
    await tokenA.transfer(acc1.address, 110);
    
    await tokenA.connect(acc1).approve(wrapContract.address, 100);
    // await tokenB.connect(acc1).approve(wrapContract.address, 50);
    // await tokenB.connect(tokenA).approve(acc1.address, 100);
    // console.log(await tokenB.allowance(owner.address, acc1.address));
    await wrapContract.connect(acc1).wrap(tokenB.address, 100);

    expect(await tokenA.balanceOf(acc1.address)).to.equal(10);
    expect(await tokenB.balanceOf(acc1.address)).to.equal(50);
    expect(await tokenB.balanceOf(wrapContract.address)).to.equal(10);
  });

  it("should unwrap tokenB into tokenA", async function () {
    const [owner, acc1,] = await ethers.getSigners();
    const TokenA = await ethers.getContractFactory("TokenA");
    const tokenA = await TokenA.deploy(1000);
    const TokenB = await ethers.getContractFactory("TokenB");
    const tokenB = await TokenB.deploy(1000);

    await Promise.all([tokenA.deployed(), tokenB.deployed()])

    const Wrap = await ethers.getContractFactory("Wrap");
    const wrapContract = await Wrap.deploy(tokenA.address);

    await wrapContract.deployed()
  
    await tokenB.transfer(acc1.address, 60);
    await tokenA.transfer(wrapContract.address, 110);
    
    await tokenB.connect(acc1).approve(wrapContract.address, 50);
    await wrapContract.connect(acc1).unwrap(tokenB.address, 100);

    expect(await tokenA.balanceOf(acc1.address)).to.equal(100);
    expect(await tokenB.balanceOf(acc1.address)).to.equal(10);
    expect(await tokenA.balanceOf(wrapContract.address)).to.equal(10);
    expect(await tokenB.balanceOf(wrapContract.address)).to.equal(50);
  });
});