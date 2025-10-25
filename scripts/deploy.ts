import { ethers } from "hardhat";

async function main() {
  const AccountabilityContract = await ethers.getContractFactory("AccountabilityContract");
  const contract = await AccountabilityContract.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("AccountabilityContract deployed to:", contractAddress);
  
  // Save the contract address to a file for the frontend to use
  const fs = require('fs');
  const contractInfo = {
    address: contractAddress,
    abi: require('../artifacts/contracts/AccountabilityContract.sol/AccountabilityContract.json').abi
  };
  
  fs.writeFileSync(
    '../src/lib/contract.json', 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Contract info saved to src/lib/contract.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
