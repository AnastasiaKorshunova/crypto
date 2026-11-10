import { network } from "hardhat";

// Usage: npx hardhat run scripts/deploy.js --network cronosTestnet
const { ethers, networkName } = await network.getOrCreate();

const [deployer] = await ethers.getSigners();
console.log("Network:", networkName);
console.log("Deploying contract with account:", deployer.address);

const MyToken = await ethers.getContractFactory("MyToken");
const myToken = await MyToken.deploy(ethers.parseEther("1000000"));
await myToken.waitForDeployment();

console.log("MyToken deployed to:", myToken.target);
console.log("Deployment transaction:", myToken.deploymentTransaction().hash);
console.log(
  "Deployer balance:",
  ethers.formatEther(await myToken.balanceOf(deployer.address)),
  await myToken.symbol(),
);
