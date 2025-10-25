'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { Clock, CheckCircle, XCircle, Upload, Eye } from 'lucide-react'

// This would be your deployed contract address
const CONTRACT_ADDRESS = '0x...' // Replace with actual deployed contract

const CONTRACT_ABI = [
  {
    "inputs": [{"name": "_user", "type": "address"}],
    "name": "getUserCommitments",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_commitmentId", "type": "uint256"}],
    "name": "getCommitment",
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          {"name": "user", "type": "address"},
          {"name": "amount", "type": "uint256"},
          {"name": "taskDescription", "type": "string"},
          {"name": "deadline", "type": "uint256"},
          {"name": "proofHash", "type": "string"},
          {"name": "isCompleted", "type": "bool"},
          {"name": "isVerified", "type": "bool"},
          {"name": "beneficiary", "type": "address"}
        ]
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

interface Commitment {
  user: string
  amount: string
  taskDescription: string
  deadline: number
  proofHash: string
  isCompleted: boolean
  isVerified: boolean
  beneficiary: string
}

export function MyCommitments() {
  const { address, isConnected } = useAccount()
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [selectedCommitment, setSelectedCommitment] = useState<number | null>(null)
  const [proofFile, setProofFile] = useState<File | null>(null)

  const { data: commitmentIds } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getUserCommitments',
    args: [address],
    query: {
      enabled: Boolean(address)
    }
  })

  useEffect(() => {
    if (commitmentIds && commitmentIds.length > 0) {
      // In a real app, you'd fetch each commitment individually
      // For now, we'll show a placeholder
      setCommitments([])
    }
  }, [commitmentIds])

  const getStatusIcon = (commitment: Commitment) => {
    if (commitment.isCompleted && commitment.isVerified) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (commitment.isCompleted && !commitment.isVerified) {
      return <XCircle className="h-5 w-5 text-red-500" />
    } else {
      return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusText = (commitment: Commitment) => {
    if (commitment.isCompleted && commitment.isVerified) {
      return 'Completed & Verified'
    } else if (commitment.isCompleted && !commitment.isVerified) {
      return 'Failed'
    } else if (new Date(commitment.deadline * 1000) < new Date()) {
      return 'Overdue'
    } else {
      return 'In Progress'
    }
  }

  const handleProofUpload = async (commitmentId: number) => {
    if (!proofFile) return

    // In a real app, you'd upload to IPFS here
    // For now, we'll just show a placeholder
    console.log('Uploading proof for commitment:', commitmentId)
    console.log('File:', proofFile.name)
  }

  if (!isConnected) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Commitments</h2>
          <p className="text-gray-600">Connect your wallet to view your commitments</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Your Commitments
        </h2>
        
        {commitments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any commitments yet.</p>
            <p className="text-sm text-gray-500">Create your first commitment above to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {commitments.map((commitment, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(commitment)}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {commitment.taskDescription}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Stake: {parseFloat(commitment.amount) / 1e18} ETH
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    getStatusText(commitment) === 'Completed & Verified' 
                      ? 'bg-green-100 text-green-800'
                      : getStatusText(commitment) === 'Failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getStatusText(commitment)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>Deadline: {new Date(commitment.deadline * 1000).toLocaleDateString()}</p>
                    {commitment.proofHash && (
                      <p>Proof submitted: {commitment.proofHash.slice(0, 10)}...</p>
                    )}
                  </div>
                  
                  {!commitment.isCompleted && new Date(commitment.deadline * 1000) > new Date() && (
                    <div className="flex space-x-2">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id={`proof-${index}`}
                      />
                      <label
                        htmlFor={`proof-${index}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer text-sm"
                      >
                        <Upload className="h-4 w-4 inline mr-1" />
                        Upload Proof
                      </label>
                      {proofFile && (
                        <button
                          onClick={() => handleProofUpload(index)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
