import { ethers } from "hardhat";

async function main() {
  // Base Sepolia USDC address (testnet)
  const BASE_SEPOLIA_USDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  
  console.log("🚀 Deploying to Base Sepolia...");
  console.log("💰 Using Base Sepolia USDC:", BASE_SEPOLIA_USDC);
  
  // Deploy AccountabilityContract with Base Sepolia USDC
  console.log("📦 Deploying AccountabilityContract...");
  const AccountabilityContract = await ethers.getContractFactory("AccountabilityContract");
  const contract = await AccountabilityContract.deploy(BASE_SEPOLIA_USDC);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ AccountabilityContract deployed to:", contractAddress);
  
  // Add ETH as supported token (address(0) represents ETH)
  console.log("🔧 Adding ETH as supported token...");
  await contract.addSupportedToken("0x0000000000000000000000000000000000000000");
  
  console.log("🎉 Base Sepolia deployment complete!");
  console.log("📋 Contract Address:", contractAddress);
  console.log("💰 USDC Address:", BASE_SEPOLIA_USDC);
  console.log("🔧 Supported Tokens: ETH (0x0) and USDC");
  console.log("🌐 Network: Base Sepolia (Chain ID: 84532)");
  
  // Save the contract info
  const fs = require('fs');
  const contractInfo = {
    network: "baseSepolia",
    chainId: 84532,
    contractAddress: contractAddress,
    usdcAddress: BASE_SEPOLIA_USDC,
    supportedTokens: {
      ETH: "0x0000000000000000000000000000000000000000",
      USDC: BASE_SEPOLIA_USDC
    },
    deploymentTime: new Date().toISOString(),
    deployer: await contract.runner?.getAddress()
  };
  
  fs.writeFileSync(
    './contract-info-base-sepolia.json', 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("💾 Contract info saved to contract-info-base-sepolia.json");
  console.log("🔗 View on Basescan: https://sepolia.basescan.org/address/" + contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
