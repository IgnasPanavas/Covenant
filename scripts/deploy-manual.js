require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to Base Sepolia...");

  // Check if private key is available
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in environment variables");
  }

  // Create a provider and wallet manually
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("Deploying contracts with the account:", wallet.address);
  console.log("Account balance:", (await provider.getBalance(wallet.address)).toString());

  // Base Sepolia USDC address
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  
  // Get the contract factory
  const AccountabilityContract = await ethers.getContractFactory("AccountabilityContract");
  
  console.log("\n⏳ Deploying AccountabilityContract...");
  console.log("Default Token (USDC):", USDC_ADDRESS);
  
  // Deploy the contract
  const accountabilityContract = await AccountabilityContract.connect(wallet).deploy(USDC_ADDRESS);
  await accountabilityContract.waitForDeployment();
  
  const contractAddress = await accountabilityContract.getAddress();
  
  console.log("\n✅ Deployment successful!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Base Sepolia Explorer:", `https://sepolia.basescan.org/address/${contractAddress}`);
  
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
  console.log(`   export const CONTRACT_ADDRESS = '${contractAddress}' as const`);
  console.log("2. Test your frontend with the new contract address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
