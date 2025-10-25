'use client'

import { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'

export function CreateCommitment() {
  const { address, isConnected } = useAccount()
  const [taskDescription, setTaskDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [beneficiary, setBeneficiary] = useState('')
  const [stakeAmount, setStakeAmount] = useState('')

  const { writeContract, isPending } = useWriteContract()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskDescription && deadline && beneficiary && stakeAmount) {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createCommitment',
        args: [taskDescription, Math.floor(new Date(deadline).getTime() / 1000), beneficiary as `0x${string}`],
        value: BigInt(Math.floor(parseFloat(stakeAmount) * 1e18))
      })
    }
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
              Stake Amount (ETH)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="0.1"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
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
