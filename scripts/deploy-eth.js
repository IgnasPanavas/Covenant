require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to Base Sepolia with ETH as default token...");

  // Check if private key is available
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in environment variables");
  }

  // Create a provider and wallet manually
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("Deploying contracts with the account:", wallet.address);
  console.log("Account balance:", (await provider.getBalance(wallet.address)).toString());

  // Use ETH as default token (address(0))
  const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
  
  // Get the contract factory
  const AccountabilityContract = await ethers.getContractFactory("AccountabilityContract");
  
  console.log("\n⏳ Deploying AccountabilityContract...");
  console.log("Default Token (ETH):", ETH_ADDRESS);
  
  // Deploy the contract
  const accountabilityContract = await AccountabilityContract.connect(wallet).deploy(ETH_ADDRESS);
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
  console.log("2. Update USDC_ADDRESS to ETH address:");
  console.log(`   export const USDC_ADDRESS = '0x0000000000000000000000000000000000000000' as const`);
  console.log("3. Test your frontend with the new contract address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
