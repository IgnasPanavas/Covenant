require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing commitment states (Complete/Fail)...");

  // Check if private key is available
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in environment variables");
  }

  // Create a provider and wallet manually
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("Using account:", wallet.address);
  console.log("Account balance:", (await provider.getBalance(wallet.address)).toString());

  const contractAddress = "0x30BA856992398382ad020740c6B59f3E78Da7a3E";
  
  // Get the contract factory
  const AccountabilityContract = await ethers.getContractFactory("AccountabilityContract");
  const contract = AccountabilityContract.connect(wallet).attach(contractAddress);
  
  console.log("\n📋 Current contract state:");
  try {
    const commitmentCount = await contract.commitmentCount();
    console.log("Total commitments:", commitmentCount.toString());
    
    const owner = await contract.owner();
    console.log("Contract owner:", owner);
    console.log("Is caller owner?", owner.toLowerCase() === wallet.address.toLowerCase());
  } catch (error) {
    console.error("Error getting contract state:", error.message);
    return;
  }

  // Get the first commitment to test with
  try {
    const commitment = await contract.getCommitment(0);
    console.log("\n📄 Commitment 0 details:");
    console.log("- User:", commitment.user);
    console.log("- Description:", commitment.description);
    console.log("- Status:", commitment.status.toString());
    console.log("- Verified:", commitment.verified);
    console.log("- Stake Amount:", commitment.stakeAmount.toString());
    
    if (commitment.status.toString() === "0") {
      console.log("\n✅ Commitment is active and ready for testing");
      
      // Test completing the commitment
      console.log("\n🎯 Testing COMPLETE commitment...");
      try {
        const tx = await contract.verifyCommitment(0, true, "Test completion - commitment was successfully completed");
        console.log("Transaction hash:", tx.hash);
        await tx.wait();
        console.log("✅ Commitment completed successfully!");
        
        // Check the updated state
        const updatedCommitment = await contract.getCommitment(0);
        console.log("Updated status:", updatedCommitment.status.toString());
        console.log("Updated verified:", updatedCommitment.verified);
        console.log("Verification reason:", updatedCommitment.verificationReason);
        
      } catch (error) {
        console.error("❌ Error completing commitment:", error.message);
      }
      
    } else if (commitment.status.toString() === "1") {
      console.log("\n✅ Commitment is already completed");
      
      // Test failing the commitment (if you want to test this, you'd need to create a new commitment first)
      console.log("\n⚠️  To test FAIL commitment, you would need to create a new commitment first");
      console.log("   Then call: verifyCommitment(commitmentId, false, 'Test failure reason')");
      
    } else {
      console.log("\n⚠️  Commitment status is:", commitment.status.toString());
    }
    
  } catch (error) {
    console.error("❌ Error getting commitment:", error.message);
  }

  console.log("\n🔧 Manual testing commands:");
  console.log("To complete a commitment:");
  console.log(`  await contract.verifyCommitment(0, true, "Success reason")`);
  console.log("\nTo fail a commitment:");
  console.log(`  await contract.verifyCommitment(0, false, "Failure reason")`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
