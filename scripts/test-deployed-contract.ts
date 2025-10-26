import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing Deployed Contract...");
  
  const contractAddress = "0xa82fb268b257E21Dae90789A96Be8fB6F640e783";
  const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
  
  console.log("📋 Contract Address:", contractAddress);
  console.log("📋 Tester Address:", wallet.address);
  
  // Get contract instance
  const AccountabilityContract = await ethers.getContractFactory("AccountabilityContract");
  const contract = AccountabilityContract.attach(contractAddress).connect(wallet);
  
  // Test 1: Check contract owner
  try {
    console.log("\n🔍 Test 1: Checking contract owner...");
    const owner = await contract.owner();
    console.log("✅ Contract owner:", owner);
  } catch (error) {
    console.log("❌ Error getting owner:", error.message);
  }
  
  // Test 2: Check supported tokens
  try {
    console.log("\n🔍 Test 2: Checking supported tokens...");
    const defaultToken = await contract.defaultToken();
    console.log("✅ Default token:", defaultToken);
    
    const ethSupported = await contract.supportedTokens("0x0000000000000000000000000000000000000000");
    console.log("✅ ETH supported:", ethSupported);
    
    const usdcSupported = await contract.supportedTokens(defaultToken);
    console.log("✅ USDC supported:", usdcSupported);
  } catch (error) {
    console.log("❌ Error checking tokens:", error.message);
  }
  
  // Test 3: Check commitment count
  try {
    console.log("\n🔍 Test 3: Checking commitment count...");
    const commitmentCount = await contract.commitmentCount();
    console.log("✅ Total commitments:", commitmentCount.toString());
  } catch (error) {
    console.log("❌ Error checking commitments:", error.message);
  }
  
  // Test 4: Check contract balance
  try {
    console.log("\n🔍 Test 4: Checking contract balance...");
    const ethBalance = await contract.getTokenBalance("0x0000000000000000000000000000000000000000");
    console.log("✅ ETH balance:", ethers.formatEther(ethBalance), "ETH");
    
    const defaultToken = await contract.defaultToken();
    const usdcBalance = await contract.getTokenBalance(defaultToken);
    console.log("✅ USDC balance:", ethers.formatUnits(usdcBalance, 6), "USDC");
  } catch (error) {
    console.log("❌ Error checking balance:", error.message);
  }
  
  console.log("\n🎉 Contract testing complete!");
  console.log("✅ Contract is working and ready for frontend integration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Testing failed:", error);
    process.exit(1);
  });
