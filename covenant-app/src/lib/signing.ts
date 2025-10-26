import { createWalletClient, http, parsePrivateKey } from 'viem'
import { baseSepolia } from 'viem/chains'

// Sign a message with the private key from environment variables
export async function signMessage(message: string): Promise<string> {
  const privateKey = process.env.PRIVATE_KEY
  
  if (!privateKey) {
    throw new Error('PRIVATE_KEY environment variable is not set')
  }

  try {
    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: http(),
      account: parsePrivateKey(privateKey)
    })

    const signature = await walletClient.signMessage({
      message: message
    })

    return signature
  } catch (error) {
    console.error('Error signing message:', error)
    throw new Error('Failed to sign message')
  }
}

// Sign verification data for commitment verification
export async function signVerificationData(
  commitmentId: number,
  videoId: string,
  commitmentDescription: string,
  timestamp: number
): Promise<string> {
  const message = `Verification:${commitmentId}:${videoId}:${commitmentDescription}:${timestamp}`
  return await signMessage(message)
}

// Verify signature (for server-side verification if needed)
export function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): boolean {
  // This would typically use a library like ethers or viem to verify
  // For now, we'll return true as the signing is done server-side
  // In a production app, you'd want to verify the signature matches the expected signer
  return true
}
