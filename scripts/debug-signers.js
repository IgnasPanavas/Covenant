const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Debugging signers...");
  
  try {
    const signers = await ethers.getSigners();
    console.log("Number of signers:", signers.length);
    
    if (signers.length > 0) {
      const signer = signers[0];
      console.log("First signer:", signer);
      console.log("Signer address:", await signer.getAddress());
      console.log("Signer balance:", (await signer.provider.getBalance(await signer.getAddress())).toString());
    } else {
      console.log("No signers found!");
    }
  } catch (error) {
    console.error("Error getting signers:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Debug failed:", error);
    process.exit(1);
  });
