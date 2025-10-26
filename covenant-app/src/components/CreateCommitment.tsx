'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI, USDC_ADDRESS } from '@/lib/contract'

export function CreateCommitment() {
  const { address, isConnected } = useAccount()
  const [taskDescription, setTaskDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [beneficiary, setBeneficiary] = useState('')
  const [stakeAmount, setStakeAmount] = useState('')
  const [tokenType, setTokenType] = useState<'ETH' | 'USDC'>('USDC')
  const [mounted, setMounted] = useState(false)

  const { writeContract, isPending, error } = useWriteContract()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Log any errors for debugging
  useEffect(() => {
    if (error) {
      console.error('Contract error:', error)
    }
  }, [error])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskDescription && deadline && beneficiary && stakeAmount) {
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000)
      const tokenAddress = tokenType === 'ETH' ? '0x0000000000000000000000000000000000000000' : USDC_ADDRESS
      const amount = tokenType === 'ETH' 
        ? BigInt(Math.floor(parseFloat(stakeAmount) * 1e18))
        : BigInt(Math.floor(parseFloat(stakeAmount) * 1e6)) // USDC has 6 decimals
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createCommitment',
        args: [
          taskDescription, 
          deadlineTimestamp, 
          beneficiary as `0x${string}`,
          tokenAddress as `0x${string}`,
          amount
        ],
        value: tokenType === 'ETH' ? amount : BigInt(0)
      })
    }
  }

  if (!mounted) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your Commitment</h2>
          <p className="text-gray-600">Loading...</p>
        </div>
      </section>
    )
  }

  if (!isConnected) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your Commitment</h2>
          <p className="text-gray-600">Connect your wallet to create a new commitment</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Create Your Commitment
        </h2>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to achieve?
            </label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="e.g., I will run 5 miles every day for 30 days"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token Type
            </label>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tokenType"
                  value="USDC"
                  checked={tokenType === 'USDC'}
                  onChange={(e) => setTokenType(e.target.value as 'ETH' | 'USDC')}
                  className="mr-2"
                />
                <span className="text-sm">USDC (Recommended)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tokenType"
                  value="ETH"
                  checked={tokenType === 'ETH'}
                  onChange={(e) => setTokenType(e.target.value as 'ETH' | 'USDC')}
                  className="mr-2"
                />
                <span className="text-sm">ETH</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stake Amount ({tokenType})
            </label>
            <input
              type="number"
              step="0.000001"
              min="0.000001"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder={tokenType === 'USDC' ? "1" : "0.000001"}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {tokenType === 'USDC' 
                ? 'USDC is stable at $1.00 - you know exactly what you\'re staking! (Min: 0.000001 USDC)'
                : 'ETH value fluctuates - check current price before staking (Min: 0.000001 ETH)'
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beneficiary Address (who gets your money if you fail)
            </label>
            <input
              type="text"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              placeholder="0x..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              This could be a charity, friend, or any Ethereum address
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              <p className="font-medium">Error creating commitment:</p>
              <p className="text-sm">{error.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !taskDescription || !deadline || !beneficiary || !stakeAmount}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Creating Commitment...' : 'Create Commitment'}
          </button>
        </form>
      </div>
    </section>
  )
}
