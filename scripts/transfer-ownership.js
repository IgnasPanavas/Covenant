require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
  console.log("🔄 Transferring contract ownership...");

  // Check if private key is available
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in environment variables");
  }

  // Create a provider and wallet manually
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("Current owner wallet:", wallet.address);
  console.log("Account balance:", (await provider.getBalance(wallet.address)).toString());

  const contractAddress = "0x30BA856992398382ad020740c6B59f3E78Da7a3E";
  
  // Get the contract factory
  const AccountabilityContract = await ethers.getContractFactory("AccountabilityContract");
  const contract = AccountabilityContract.connect(wallet).attach(contractAddress);
  
  // Check current owner
  try {
    const currentOwner = await contract.owner();
    console.log("Current contract owner:", currentOwner);
    console.log("Are you the owner?", currentOwner.toLowerCase() === wallet.address.toLowerCase());
    
    if (currentOwner.toLowerCase() === wallet.address.toLowerCase()) {
      console.log("✅ You are already the owner! The issue might be with wallet connection in frontend.");
      console.log("Please check that your frontend is connected to the same wallet address:", wallet.address);
    } else {
      console.log("❌ You are not the owner. Cannot transfer ownership.");
    }
    
  } catch (error) {
    console.error("Error checking ownership:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
