// Contract configuration for AccountabilityContract
// Localhost (testing)
export const CONTRACT_ADDRESS = '0x30BA856992398382ad020740c6B59f3E78Da7a3E' as const
export const USDC_ADDRESS = '0x0000000000000000000000000000000000000000' as const // ETH

// Base Mainnet (production) - Update these when deploying to Base
// export const CONTRACT_ADDRESS = '0x...' as const
// export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const // Base USDC

// Import the complete ABI from the deployed contract
import contractInfo from './contract.json'

export const CONTRACT_ABI = contractInfo.abi