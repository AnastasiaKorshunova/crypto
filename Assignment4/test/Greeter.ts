import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("Greeter", function () {
  it("Should greet with the name passed to the constructor", async function () {
    const greeter = await ethers.deployContract("Greeter", ["Anastasia"]);

    expect(await greeter.greet()).to.equal("Hello, Anastasia!");
  });

  it("Should handle an empty name", async function () {
    const greeter = await ethers.deployContract("Greeter", [""]);

    expect(await greeter.greet()).to.equal("Hello, !");
  });
});
