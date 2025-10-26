require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking commitment status...");

  // Check if private key is available
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in environment variables");
  }

  // Create a provider and wallet manually
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("Using account:", wallet.address);

  const contractAddress = "0x30BA856992398382ad020740c6B59f3E78Da7a3E";
  
  // Get the contract factory
  const AccountabilityContract = await ethers.getContractFactory("AccountabilityContract");
  const contract = AccountabilityContract.connect(wallet).attach(contractAddress);
  
  try {
    // Get commitment count
    const commitmentCount = await contract.commitmentCount();
    console.log("Total commitments:", commitmentCount.toString());
    
    // Check each commitment
    for (let i = 0; i < Number(commitmentCount); i++) {
      console.log(`\n📄 Commitment ${i}:`);
      
      const commitment = await contract.getCommitment(i);
      console.log("- User:", commitment.user);
      console.log("- Description:", commitment.description);
      console.log("- Status:", commitment.status.toString());
      console.log("- Verified:", commitment.verified);
      console.log("- Stake Amount:", ethers.formatEther(commitment.stakeAmount), "ETH");
      console.log("- Beneficiary:", commitment.beneficiary);
      console.log("- Verification Reason:", commitment.verificationReason);
      
      // Status interpretation
      const status = Number(commitment.status);
      if (status === 0) {
        console.log("🟡 Status: Active");
      } else if (status === 1) {
        console.log("✅ Status: Completed");
      } else if (status === 2) {
        console.log("❌ Status: Failed");
      } else {
        console.log("❓ Status: Unknown");
      }
    }
    
  } catch (error) {
    console.error("❌ Error checking commitments:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
