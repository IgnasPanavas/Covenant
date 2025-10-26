import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Testing network configuration...");
  
  try {
    const provider = ethers.provider;
    console.log("✅ Provider created");
    
    const network = await provider.getNetwork();
    console.log("🌐 Current network:", network.name, "Chain ID:", network.chainId.toString());
    
    // Try to get block number
    const blockNumber = await provider.getBlockNumber();
    console.log("📦 Current block number:", blockNumber);
    
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
