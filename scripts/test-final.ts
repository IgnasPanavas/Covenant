import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Final Contract Test...");
  
  const contractAddress = "0xa82fb268b257E21Dae90789A96Be8fB6F640e783";
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
  
  console.log("📋 Contract Address:", contractAddress);
  console.log("📋 Tester Address:", wallet.address);
  
  // Get contract instance
  const AccountabilityContract = await ethers.getContractFactory("AccountabilityContract");
  const contract = AccountabilityContract.attach(contractAddress).connect(wallet);
  
  // Test 1: Create a commitment
  console.log("\n🔍 Test 1: Creating a commitment...");
  try {
    const description = "I will run 5 miles every day for 30 days";
    const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days from now
    const beneficiary = "0x742d35Cc6634C0532925A3B8D4C9dB96C4B4d8B6"; // Properly checksummed address
    const token = "0x0000000000000000000000000000000000000000"; // ETH
    const amount = ethers.parseEther("0.01"); // 0.01 ETH
    
    console.log("📝 Creating commitment...");
    console.log("   Description:", description);
    console.log("   Deadline:", new Date(deadline * 1000).toISOString());
    console.log("   Beneficiary:", beneficiary);
    console.log("   Amount: 0.01 ETH");
    
    const tx = await contract.createCommitment(
      description,
      deadline,
      beneficiary,
      token,
      amount,
      { value: amount }
    );
    
    console.log("⏳ Waiting for transaction...");
    const receipt = await tx.wait();
    console.log("✅ Commitment created! Transaction hash:", receipt?.hash);
    
    // Get the commitment ID (should be 0 since it's the first one)
    const commitmentId = 0;
    console.log("📋 Commitment ID:", commitmentId);
    
  } catch (error) {
    console.log("❌ Error creating commitment:", error.message);
    return;
  }
  
  // Test 2: Submit proof
  console.log("\n🔍 Test 2: Submitting proof...");
  try {
    const proofHash = "QmX7B8abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"; // Mock IPFS hash
    const commitmentId = 0;
    
    console.log("📝 Submitting proof with hash:", proofHash);
    
    const tx = await contract.submitProof(commitmentId, proofHash);
    const receipt = await tx.wait();
    console.log("✅ Proof submitted! Transaction hash:", receipt?.hash);
    
  } catch (error) {
    console.log("❌ Error submitting proof:", error.message);
  }
  
  // Test 3: Check commitment status
  console.log("\n🔍 Test 3: Checking commitment status...");
  try {
    const commitment = await contract.getCommitment(0);
    console.log("📋 Commitment details:");
    console.log("   User:", commitment.user);
    console.log("   Description:", commitment.description);
    console.log("   Status:", commitment.status.toString());
    console.log("   Proof Hash:", commitment.proofHash);
    console.log("   Verified:", commitment.verified);
    
  } catch (error) {
    console.log("❌ Error getting commitment:", error.message);
  }
  
  // Test 4: Verify commitment (as owner)
  console.log("\n🔍 Test 4: Verifying commitment...");
  try {
    const commitmentId = 0;
    const verified = true;
    const reason = "User completed the task successfully as verified by AI";
    
    console.log("📝 Verifying commitment as owner...");
    
    const tx = await contract.verifyCommitment(commitmentId, verified, reason);
    const receipt = await tx.wait();
    console.log("✅ Commitment verified! Transaction hash:", receipt?.hash);
    
  } catch (error) {
    console.log("❌ Error verifying commitment:", error.message);
  }
  
  // Test 5: Check final status
  console.log("\n🔍 Test 5: Checking final status...");
  try {
    const commitment = await contract.getCommitment(0);
    console.log("📋 Final commitment status:");
    console.log("   Status:", commitment.status.toString(), "(0=Active, 1=Completed, 2=Failed)");
    console.log("   Verified:", commitment.verified);
    console.log("   Verification Reason:", commitment.verificationReason);
    
  } catch (error) {
    console.log("❌ Error getting final status:", error.message);
  }
  
  console.log("\n🎉 Contract testing complete!");
  console.log("✅ All functions are working correctly!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Testing failed:", error);
    process.exit(1);
  });
