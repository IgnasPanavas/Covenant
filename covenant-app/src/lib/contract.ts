// Contract configuration for AccountabilityContract
// Localhost (testing)
export const CONTRACT_ADDRESS = '0xa82fb268b257E21Dae90789A96Be8fB6F640e783' as const
export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const

// Base Mainnet (production) - Update these when deploying to Base
// export const CONTRACT_ADDRESS = '0x...' as const
// export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const // Base USDC

// Import the complete ABI from the deployed contract
import contractInfo from './contract.json'

export const CONTRACT_ABI = contractInfo.abi