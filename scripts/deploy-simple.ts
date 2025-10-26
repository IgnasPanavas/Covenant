import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying to Base Sepolia...");
  
  // Create provider and wallet
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
  
  console.log("📋 Deployer address:", wallet.address);
  
  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.log("❌ No ETH in wallet! Get testnet ETH from:");
    console.log("🔗 https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet");
    return;
  }
  
  // Base Sepolia USDC address
  const BASE_SEPOLIA_USDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  
  // Deploy contract
  console.log("📦 Deploying AccountabilityContract...");
  const AccountabilityContract = await ethers.getContractFactory("AccountabilityContract");
  const contract = await AccountabilityContract.connect(wallet).deploy(BASE_SEPOLIA_USDC);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ AccountabilityContract deployed to:", contractAddress);
  
  // Add ETH as supported token
  console.log("🔧 Adding ETH as supported token...");
  await contract.addSupportedToken("0x0000000000000000000000000000000000000000");
  
  console.log("🎉 Deployment complete!");
  console.log("📋 Contract Address:", contractAddress);
  console.log("🔗 View on Basescan: https://sepolia.basescan.org/address/" + contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
