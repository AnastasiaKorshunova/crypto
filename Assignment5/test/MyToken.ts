import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

const INITIAL_SUPPLY = ethers.parseEther("1000000");

async function deployMyToken() {
  const [owner, alice, bob] = await ethers.getSigners();
  const myToken = await ethers.deployContract("MyToken", [INITIAL_SUPPLY]);
  return { myToken, owner, alice, bob };
}

describe("MyToken", function () {
  describe("Deployment", function () {
    it("Should deploy with correct initial supply", async function () {
      const { myToken, owner } = await deployMyToken();

      expect(await myToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
      expect(await myToken.totalSupply()).to.equal(INITIAL_SUPPLY);
    });

    it("Should set name, symbol and decimals", async function () {
      const { myToken } = await deployMyToken();

      expect(await myToken.name()).to.equal("MyToken");
      expect(await myToken.symbol()).to.equal("MTK");
      expect(await myToken.decimals()).to.equal(18n);
    });

    it("Should make the deployer the owner", async function () {
      const { myToken, owner } = await deployMyToken();

      expect(await myToken.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should let the owner mint tokens to any address", async function () {
      const { myToken, alice } = await deployMyToken();
      const amount = ethers.parseEther("500");

      await expect(myToken.mint(alice.address, amount))
        .to.emit(myToken, "Transfer")
        .withArgs(ethers.ZeroAddress, alice.address, amount);

      expect(await myToken.balanceOf(alice.address)).to.equal(amount);
      expect(await myToken.totalSupply()).to.equal(INITIAL_SUPPLY + amount);
    });

    it("Should revert when a non-owner tries to mint", async function () {
      const { myToken, alice } = await deployMyToken();

      await expect(myToken.connect(alice).mint(alice.address, ethers.parseEther("1")))
        .to.be.revertedWithCustomError(myToken, "OwnableUnauthorizedAccount")
        .withArgs(alice.address);

      expect(await myToken.totalSupply()).to.equal(INITIAL_SUPPLY);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const { myToken, owner, alice, bob } = await deployMyToken();
      const amount = ethers.parseEther("100");

      await expect(myToken.transfer(alice.address, amount)).to.changeTokenBalances(
        ethers,
        myToken,
        [owner, alice],
        [-amount, amount],
      );

      const half = amount / 2n;
      await expect(myToken.connect(alice).transfer(bob.address, half))
        .to.emit(myToken, "Transfer")
        .withArgs(alice.address, bob.address, half);

      expect(await myToken.balanceOf(alice.address)).to.equal(half);
      expect(await myToken.balanceOf(bob.address)).to.equal(half);
    });

    it("Should revert when transferring more than the balance", async function () {
      const { myToken, alice, bob } = await deployMyToken();
      const amount = ethers.parseEther("10");
      await myToken.transfer(alice.address, amount);

      await expect(myToken.connect(alice).transfer(bob.address, amount + 1n))
        .to.be.revertedWithCustomError(myToken, "ERC20InsufficientBalance")
        .withArgs(alice.address, amount, amount + 1n);

      expect(await myToken.balanceOf(alice.address)).to.equal(amount);
      expect(await myToken.balanceOf(bob.address)).to.equal(0n);
    });

    it("Should revert when transferring from an account with no tokens", async function () {
      const { myToken, alice, bob } = await deployMyToken();

      await expect(myToken.connect(alice).transfer(bob.address, 1n))
        .to.be.revertedWithCustomError(myToken, "ERC20InsufficientBalance")
        .withArgs(alice.address, 0n, 1n);
    });

    it("Should revert when transferring to the zero address", async function () {
      const { myToken } = await deployMyToken();

      await expect(myToken.transfer(ethers.ZeroAddress, 1n))
        .to.be.revertedWithCustomError(myToken, "ERC20InvalidReceiver")
        .withArgs(ethers.ZeroAddress);
    });
  });

  describe("Allowances (approve / transferFrom)", function () {
    it("Should let a spender transfer within the allowance", async function () {
      const { myToken, owner, alice, bob } = await deployMyToken();
      const allowance = ethers.parseEther("50");
      const amount = ethers.parseEther("30");

      await expect(myToken.approve(alice.address, allowance))
        .to.emit(myToken, "Approval")
        .withArgs(owner.address, alice.address, allowance);

      await expect(
        myToken.connect(alice).transferFrom(owner.address, bob.address, amount),
      ).to.changeTokenBalances(ethers, myToken, [owner, bob], [-amount, amount]);

      expect(await myToken.allowance(owner.address, alice.address)).to.equal(
        allowance - amount,
      );
    });

    it("Should revert when transferFrom exceeds the allowance", async function () {
      const { myToken, owner, alice, bob } = await deployMyToken();
      const allowance = ethers.parseEther("50");
      await myToken.approve(alice.address, allowance);

      await expect(
        myToken.connect(alice).transferFrom(owner.address, bob.address, allowance + 1n),
      )
        .to.be.revertedWithCustomError(myToken, "ERC20InsufficientAllowance")
        .withArgs(alice.address, allowance, allowance + 1n);
    });

    it("Should revert when transferFrom exceeds the owner's balance", async function () {
      const { myToken, owner, alice, bob } = await deployMyToken();
      await myToken.transfer(alice.address, ethers.parseEther("5"));
      await myToken.connect(alice).approve(bob.address, ethers.parseEther("100"));

      await expect(
        myToken.connect(bob).transferFrom(alice.address, owner.address, ethers.parseEther("6")),
      ).to.be.revertedWithCustomError(myToken, "ERC20InsufficientBalance");
    });
  });
});
