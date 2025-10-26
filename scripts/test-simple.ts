import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Simple Contract Test...");
  
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
    const beneficiary = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"; // Random address
    const token = "0x0000000000000000000000000000000000000000"; // ETH
    const amount = ethers.parseEther("0.01"); // 0.01 ETH
    
    console.log("📝 Creating commitment...");
    
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
    
  } catch (error) {
    console.log("❌ Error creating commitment:", error.message);
  }
  
  console.log("\n🎉 Test complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Testing failed:", error);
    process.exit(1);
  });
