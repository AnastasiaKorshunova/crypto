import { network } from "hardhat";

// Usage: GREETER_ADDRESS=0x... npx hardhat run scripts/greet.ts --network sepolia
const address = process.env.GREETER_ADDRESS;
if (!address) {
  throw new Error("Set GREETER_ADDRESS to the deployed Greeter contract address");
}

const { ethers, networkName } = await network.getOrCreate();

const greeter = await ethers.getContractAt("Greeter", address);
console.log(`Greeter at ${address} on ${networkName} says: ${await greeter.greet()}`);
