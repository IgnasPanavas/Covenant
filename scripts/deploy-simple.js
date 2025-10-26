const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to Base Sepolia...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Base Sepolia USDC address
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  
  // Get the contract factory
  const AccountabilityContract = await ethers.getContractFactory("AccountabilityContract");
  
  console.log("\n⏳ Deploying AccountabilityContract...");
  console.log("Default Token (USDC):", USDC_ADDRESS);
  
  // Deploy the contract
  const accountabilityContract = await AccountabilityContract.deploy(USDC_ADDRESS);
  await accountabilityContract.deployed();
  
  console.log("\n✅ Deployment successful!");
  console.log("📍 Contract Address:", accountabilityContract.address);
  console.log("🔗 Base Sepolia Explorer:", `https://sepolia.basescan.org/address/${accountabilityContract.address}`);
  
  // Verify the contract is working
  console.log("\n🔍 Verifying deployment...");
  try {
    const owner = await accountabilityContract.owner();
    console.log("✅ Owner:", owner);
    
    const defaultToken = await accountabilityContract.defaultToken();
    console.log("✅ Default Token:", defaultToken);
    
    const nextCommitmentId = await accountabilityContract.nextCommitmentId();
    console.log("✅ Next Commitment ID:", nextCommitmentId.toString());
    
    console.log("\n🎉 Contract is working correctly!");
  } catch (error) {
    console.error("❌ Error verifying contract:", error.message);
  }
  
  console.log("\n🔧 Next steps:");
  console.log("1. Update your contract.ts file with the new address:");
  console.log(`   export const CONTRACT_ADDRESS = '${accountabilityContract.address}' as const`);
  console.log("2. Test your frontend with the new contract address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
