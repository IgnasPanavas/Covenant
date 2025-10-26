'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'

export function CommitmentTester() {
  const { address, isConnected } = useAccount()
  const [commitmentId, setCommitmentId] = useState('0')
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-4">🧪 Commitment State Tester</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-blue-200 rounded"></div>
          <div className="h-10 bg-blue-200 rounded"></div>
          <div className="h-10 bg-blue-200 rounded"></div>
        </div>
      </div>
    )
  }

  const handleCompleteCommitment = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI as any,
        functionName: 'verifyCommitment',
        args: [BigInt(commitmentId), true, reason || 'Completed via frontend test'],
      })
    } catch (err) {
      console.error('Error completing commitment:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFailCommitment = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI as any,
        functionName: 'verifyCommitment',
        args: [BigInt(commitmentId), false, reason || 'Failed via frontend test'],
      })
    } catch (err) {
      console.error('Error failing commitment:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Commitment Tester</h3>
        <p className="text-yellow-700">Connect your wallet to test commitment states</p>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-blue-800 mb-4">🧪 Commitment State Tester</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Commitment ID:
          </label>
          <input
            type="number"
            value={commitmentId}
            onChange={(e) => setCommitmentId(e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Reason (optional):
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Test completion/failure reason"
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleCompleteCommitment}
            disabled={isPending || isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending || isLoading ? 'Processing...' : '✅ Complete Commitment'}
          </button>
          
          <button
            onClick={handleFailCommitment}
            disabled={isPending || isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending || isLoading ? 'Processing...' : '❌ Fail Commitment'}
          </button>
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">
            Error: {error.message}
          </div>
        )}
        
        {hash && (
          <div className="text-sm">
            <p className="text-blue-600">Transaction Hash: {hash}</p>
            {isConfirming && <p className="text-yellow-600">Confirming transaction...</p>}
            {isConfirmed && <p className="text-green-600">✅ Transaction confirmed!</p>}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-blue-600">
        <p><strong>Note:</strong> Only the contract owner can verify commitments.</p>
        <p>This will change the commitment status and trigger fund transfers.</p>
      </div>
    </div>
  )
}
