const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to Base Sepolia...");

  // Get the contract factory
  const AccountabilityContract = await ethers.getContractFactory("AccountabilityContract");
  
  // Base Sepolia USDC address (for testing)
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  
  console.log("📋 Contract details:");
  console.log("- Contract: AccountabilityContract");
  console.log("- Default Token (USDC):", USDC_ADDRESS);
  console.log("- Network: Base Sepolia");
  
  // Deploy the contract
  console.log("\n⏳ Deploying contract...");
  const accountabilityContract = await AccountabilityContract.deploy(USDC_ADDRESS);
  
  // Wait for deployment to complete
  await accountabilityContract.deployed();
  
  const contractAddress = accountabilityContract.address;
  
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
  
  // Save deployment info
  const deploymentInfo = {
    network: "baseSepolia",
    contractAddress: contractAddress,
    usdcAddress: USDC_ADDRESS,
    deploymentTime: new Date().toISOString(),
    deployer: await accountabilityContract.signer.getAddress()
  };
  
  console.log("\n📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n🔧 Next steps:");
  console.log("1. Update your contract.ts file with the new address:");
  console.log(`   export const CONTRACT_ADDRESS = '${contractAddress}' as const`);
  console.log("2. Update your contract.json file with the new ABI if needed");
  console.log("3. Test your frontend with the new contract address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
