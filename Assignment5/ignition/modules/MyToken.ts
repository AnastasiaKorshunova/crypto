import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyTokenModule", (m) => {
  // 1,000,000 MTK with 18 decimals
  const initialSupply = m.getParameter("initialSupply", 1_000_000n * 10n ** 18n);
  const myToken = m.contract("MyToken", [initialSupply]);

  return { myToken };
});
