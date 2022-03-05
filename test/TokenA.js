const { expect } = require("chai");
const { ethers } = require("hardhat");

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

describe("TokenA", function () {
  it("should wrap tokenA into tokenB", async function () {
    const [owner, acc1,] = await ethers.getSigners();
    const TokenA = await ethers.getContractFactory("TokenA");
    const tokenA = await TokenA.deploy(1000);
    const TokenB = await ethers.getContractFactory("TokenB");
    const tokenB = await TokenB.deploy(100);

    await Promise.all([tokenA.deployed(), tokenB.deployed()])

    await tokenB.transfer(tokenA.address, 60);
    await tokenA.transfer(acc1.address, 110);
    
    // await tokenB.connect(owner).approve(acc1.address, 100);
    // await tokenB.connect(tokenA).approve(acc1.address, 100);
    // console.log(await tokenB.allowance(owner.address, acc1.address));
    await tokenA.connect(acc1).wrap(tokenB.address, 100);

    expect(await tokenA.balanceOf(acc1.address)).to.equal(10);
    expect(await tokenB.balanceOf(acc1.address)).to.equal(50);
    expect(await tokenB.balanceOf(tokenA.address)).to.equal(10);
  });

  it("should unwrap tokenB into tokenA", async function () {
    const [owner, acc1,] = await ethers.getSigners();
    const TokenA = await ethers.getContractFactory("TokenA");
    const tokenA = await TokenA.deploy(100);
    const TokenB = await ethers.getContractFactory("TokenB");
    const tokenB = await TokenB.deploy(100);

    await Promise.all([tokenA.deployed(), tokenB.deployed()])

    await tokenB.transfer(acc1.address, 60);
    
    await tokenB.connect(acc1).approve(tokenA.address, 50);
    await tokenA.connect(acc1).unwrap(tokenB.address, 100);

    expect(await tokenA.balanceOf(acc1.address)).to.equal(100);
    expect(await tokenB.balanceOf(acc1.address)).to.equal(10);
  });
});

