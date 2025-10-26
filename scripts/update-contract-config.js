const fs = require('fs');
const path = require('path');

// This script updates the contract configuration after deployment
function updateContractConfig(contractAddress) {
  const contractTsPath = path.join(__dirname, '../covenant-app/src/lib/contract.ts');
  
  console.log('📝 Updating contract configuration...');
  console.log('📍 New contract address:', contractAddress);
  
  // Read the current contract.ts file
  let contractTs = fs.readFileSync(contractTsPath, 'utf8');
  
  // Update the contract address
  contractTs = contractTs.replace(
    /export const CONTRACT_ADDRESS = '.*' as const/,
    `export const CONTRACT_ADDRESS = '${contractAddress}' as const`
  );
  
  // Write the updated file
  fs.writeFileSync(contractTsPath, contractTs);
  
  console.log('✅ Contract configuration updated successfully!');
  console.log('📁 Updated file:', contractTsPath);
}

// Get contract address from command line argument
const contractAddress = process.argv[2];

if (!contractAddress) {
  console.error('❌ Please provide the contract address as an argument');
  console.log('Usage: node update-contract-config.js <contract-address>');
  process.exit(1);
}

// Validate the address format
if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
  console.error('❌ Invalid contract address format');
  process.exit(1);
}

updateContractConfig(contractAddress);
