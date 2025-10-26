'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { Clock, CheckCircle, XCircle, Upload, Brain, DollarSign } from 'lucide-react'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract'

interface Commitment {
  id: number
  user: string
  amount: string
  taskDescription: string
  deadline: number
  proofHash: string
  isCompleted: boolean
  isVerified: boolean
  beneficiary: string
  token: string
  status: number // Add the actual status from contract (0: Active, 1: Completed, 2: Failed)
  aiVerified?: boolean
  userPresent?: boolean
  comments?: string
  videoId?: string
  verificationInProgress?: boolean
  signature?: string
  timestamp?: number
}

export function MyCommitments() {
  const { address, isConnected } = useAccount()
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [mounted, setMounted] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [uploadingCommitmentId, setUploadingCommitmentId] = useState<number | null>(null)
  const [verifyingCommitmentId, setVerifyingCommitmentId] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: commitmentIds, error: commitmentIdsError, isLoading: loadingIds } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI as any,
    functionName: 'getUserCommitments',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address)
    }
  })

  console.log('getUserCommitments debug:')
  console.log('- commitmentIds:', commitmentIds)
  console.log('- commitmentIdsError:', commitmentIdsError)
  console.log('- loadingIds:', loadingIds)

  const { data: totalCommitments, error: totalCommitmentsError } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI as any,
    functionName: 'commitmentCount',
    query: {
      enabled: Boolean(address)
    }
  })

  console.log('commitmentCount debug:')
  console.log('- totalCommitments:', totalCommitments)
  console.log('- totalCommitmentsError:', totalCommitmentsError)

  // Fetch all commitments for the user
  const contracts = Array.isArray(commitmentIds) && commitmentIds.length > 0 
    ? commitmentIds.map((id) => ({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI as any,
        functionName: 'getCommitment',
        args: [BigInt(id)], // Ensure it's a BigInt for uint256
      }))
    : []

  console.log('useReadContracts contracts:', contracts)
  console.log('CONTRACT_ADDRESS:', CONTRACT_ADDRESS)

  const { data: allCommitmentsData, isLoading: loadingCommitments } = useReadContracts({
    contracts,
    query: {
      enabled: Array.isArray(commitmentIds) && commitmentIds.length > 0,
    },
  })

  console.log('Debug Info:')
  console.log('- Address:', address)
  console.log('- Commitment IDs:', commitmentIds)
  console.log('- All commitments data:', allCommitmentsData)
  console.log('- Loading commitments:', loadingCommitments)

  useEffect(() => {
    console.log('Processing commitments data:', allCommitmentsData)
    console.log('Commitment IDs:', commitmentIds)
    
    if (!allCommitmentsData || !Array.isArray(commitmentIds) || commitmentIds.length === 0) {
      console.log('No commitments data or no commitment IDs')
      setCommitments([])
      return
    }

    const fetchedCommitments: Commitment[] = []
    
    allCommitmentsData.forEach((commitmentData, index) => {
      console.log(`Processing commitment ${index}:`, commitmentData)
      console.log(`Commitment data status:`, commitmentData.status)
      console.log(`Commitment data result:`, commitmentData.result)
      console.log(`Commitment data error:`, commitmentData.error)
      
      if (commitmentData.status === 'success' && commitmentData.result) {
        const data = commitmentData.result as any
        const commitmentId = Number(commitmentIds[index])
        
        console.log(`Successfully fetched commitment ${commitmentId}:`, data)
        console.log(`Description from contract:`, data.description)
        console.log(`Description type:`, typeof data.description)
        console.log(`All data keys:`, Object.keys(data))
        console.log(`Data description directly:`, data.description)
        console.log(`Data description with bracket notation:`, data['description'])
        console.log(`Full result object:`, commitmentData.result)
        
        // Map the data according to the deployed contract structure:
        // user, description, deadline, beneficiary, stakeAmount, token, status, proofHash, verified, verificationReason
        const commitment: Commitment = {
          id: commitmentId,
          user: data.user || '',
          amount: (data.stakeAmount || 0).toString(),
          taskDescription: data.description || '',
          deadline: Number(data.deadline || 0),
          proofHash: data.proofHash || '',
          isCompleted: data.status === 1, // 1 = Completed
          isVerified: data.status === 1 && data.verified, // Only verified if status is 1 (Completed) AND verified is true
          beneficiary: data.beneficiary || '0x0',
          token: data.token || '0x0',
          status: Number(data.status || 0), // Add the actual status from contract
        }
        
        console.log(`Mapped commitment:`, commitment)
        console.log(`Mapped commitment taskDescription:`, commitment.taskDescription)
        console.log(`Mapped commitment taskDescription length:`, commitment.taskDescription?.length)
        console.log(`Mapped commitment status:`, commitment.status)
        console.log(`Original data status:`, data.status)
        
        fetchedCommitments.push(commitment)
      } else {
        console.log(`Failed to fetch commitment ${index}:`, commitmentData)
        console.log(`Error details:`, commitmentData.error)
      }
    })
    
    console.log('Final fetched commitments:', fetchedCommitments)
    console.log('Final commitments taskDescriptions:', fetchedCommitments.map(c => c.taskDescription))
    setCommitments(fetchedCommitments)
  }, [allCommitmentsData, commitmentIds])

  const getStatusIcon = (commitment: Commitment) => {
    if (commitment.status === 1) {
      return <CheckCircle className="h-5 w-5 text-earth-green-600" />
    } else if (commitment.status === 2) {
      return <XCircle className="h-5 w-5 text-red-600" />
    } else {
      return <Clock className="h-5 w-5 text-earth-brown-500" />
    }
  }

  const getStatusText = (commitment: Commitment) => {
    if (commitment.status === 1) {
      return 'Completed & Verified'
    } else if (commitment.status === 2) {
      return 'Failed'
    } else if (new Date(commitment.deadline * 1000) < new Date()) {
      return 'Overdue'
    } else {
      return 'In Progress'
    }
  }

  const formatAmount = (amount: string, token: string) => {
    // ETH uses 18 decimals, USDC uses 6 decimals
    const decimals = token === '0x0000000000000000000000000000000000000000' || !token ? 18 : 6
    const amountNum = Number(amount) / Math.pow(10, decimals)
    
    if (token === '0x0000000000000000000000000000000000000000' || !token) {
      return `${amountNum.toFixed(6)} ETH`
    }
    return `${amountNum.toFixed(6)} USDC`
  }

  const handleProofUpload = async (commitmentId: number) => {
    if (!proofFile) return

    setUploadingCommitmentId(commitmentId)
    try {
      const formData = new FormData()
      formData.append('file', proofFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Upload failed:', response.status, errorData)
        throw new Error(`Upload failed: ${errorData.error || `HTTP ${response.status}`}`)
      }

      const uploadResult = await response.json()
      console.log('Upload successful:', uploadResult)

      // Update the commitment with the video ID
      setCommitments(prev => prev.map(commitment => 
        commitment.id === commitmentId 
          ? { ...commitment, videoId: uploadResult.video_id }
          : commitment
      ))

      // Automatically trigger verification after successful upload
      if (uploadResult.video_id) {
        await handleVerification(commitmentId, uploadResult.video_id)
      }

    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload video. Please try again.')
    } finally {
      setUploadingCommitmentId(null)
      setProofFile(null)
    }
  }

  const handleVerification = async (commitmentId: number, videoId?: string) => {
    const commitment = commitments.find(c => c.id === commitmentId)
    if (!commitment) return

    const videoIdToUse = videoId || commitment.videoId
    if (!videoIdToUse) {
      alert('No video available for verification')
      return
    }

    setVerifyingCommitmentId(commitmentId)
    
    // Update commitment to show verification in progress
    setCommitments(prev => prev.map(c => 
      c.id === commitmentId 
        ? { ...c, verificationInProgress: true }
        : c
    ))

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: videoIdToUse,
          commitmentDescription: commitment.taskDescription,
          commitmentId: commitmentId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Verification failed:', response.status, errorData)
        throw new Error(`Verification failed: ${errorData.error || `HTTP ${response.status}`}`)
      }

      const verificationResult = await response.json()
      console.log('Verification result:', verificationResult)

      // Update the commitment with verification results
      setCommitments(prev => prev.map(c => 
        c.id === commitmentId 
          ? { 
              ...c, 
              aiVerified: verificationResult.verified,
              userPresent: verificationResult.user_present,
              comments: verificationResult.comments,
              verificationInProgress: false,
              signature: verificationResult.signature,
              timestamp: verificationResult.timestamp
            }
          : c
      ))

    } catch (error) {
      console.error('Verification error:', error)
      alert('Failed to verify commitment. Please try again.')
      
      // Reset verification in progress state
      setCommitments(prev => prev.map(c => 
        c.id === commitmentId 
          ? { ...c, verificationInProgress: false }
          : c
      ))
    } finally {
      setVerifyingCommitmentId(null)
    }
  }

  if (!mounted) {
    return (
      <section className="py-20 bg-earth-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-earth-green-900 mb-4">Your Commitments</h2>
          <p className="text-earth-text-light">Loading...</p>
        </div>
      </section>
    )
  }

  if (!mounted) {
    return (
      <section className="py-20 bg-earth-bg">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-earth-green-900 mb-8">
            Your Commitments
          </h2>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    )
  }

  if (!isConnected) {
    return (
      <section className="py-20 bg-earth-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-earth-green-900 mb-4">Your Commitments</h2>
          <p className="text-earth-text-light">Connect your wallet to view your commitments</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-earth-bg">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-earth-green-900 mb-8">
          Your Commitments
        </h2>
        
      
        
        
        {commitments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-earth-text mb-4">You haven't created any commitments yet.</p>
            <p className="text-sm text-earth-text-light">Create your first commitment above to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {commitments.map((commitment) => (
              <div key={commitment.id} className="bg-earth-brown-100 p-6 rounded-lg border border-earth-brown-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(commitment)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-earth-green-900 text-lg mb-2">
                        {commitment.taskDescription || 'No description provided'}
                      </h3>
                      
                      <p className="text-sm text-earth-text flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Stake: {formatAmount(commitment.amount, commitment.token)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    getStatusText(commitment) === 'Completed & Verified' 
                      ? 'bg-earth-green-100 text-earth-green-800'
                      : getStatusText(commitment) === 'Failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-earth-brown-200 text-earth-brown-900'
                  }`}>
                    {getStatusText(commitment)}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-earth-text-light">Commitment ID</p>
                    <p className="text-earth-text font-mono">#{commitment.id}</p>
                  </div>
                  <div>
                    <p className="text-earth-text-light">Deadline</p>
                    <p className="text-earth-text">
                      {new Date(commitment.deadline * 1000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-earth-text-light">Beneficiary</p>
                    <p className="text-earth-text font-mono text-xs">
                      {commitment.beneficiary.slice(0, 6)}...{commitment.beneficiary.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-earth-text-light">Token</p>
                    <p className="text-earth-text">
                      {commitment.token === '0x0000000000000000000000000000000000000000' || !commitment.token
                        ? 'ETH' 
                        : 'USDC'}
                    </p>
                  </div>
                </div>

                {/* AI Verification Status */}
                {(commitment.aiVerified !== undefined || commitment.verificationInProgress) && (
                  <div className={`mb-4 p-3 rounded-lg border ${
                    commitment.verificationInProgress 
                      ? 'bg-yellow-50 border-yellow-200'
                      : commitment.aiVerified 
                        ? 'bg-earth-green-50 border-earth-green-200'
                        : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start gap-2">
                      <Brain className={`h-4 w-4 mt-0.5 ${
                        commitment.verificationInProgress 
                          ? 'text-yellow-700'
                          : commitment.aiVerified 
                            ? 'text-earth-green-700'
                            : 'text-red-700'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-earth-green-900">
                            AI Verification
                          </p>
                          {commitment.verificationInProgress ? (
                            <span className="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                              Verifying...
                            </span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              commitment.aiVerified
                                ? 'bg-earth-green-100 text-earth-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {commitment.aiVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          )}
                          {commitment.userPresent !== undefined && (
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              commitment.userPresent
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {commitment.userPresent ? 'User Present' : 'User Not Present'}
                            </span>
                          )}
                        </div>
                        {commitment.comments && (
                          <p className="text-xs text-earth-text mt-1">{commitment.comments}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Proof Hash */}
                {commitment.proofHash && (
                  <div className="mb-4">
                    <p className="text-sm text-earth-text-light mb-1">Proof Hash</p>
                    <p className="text-xs font-mono text-earth-text bg-earth-brown-50 p-2 rounded break-all">
                      {commitment.proofHash}
                    </p>
                  </div>
                )}

                {/* Verification Signature */}
                {commitment.signature && (
                  <div className="mb-4">
                    <p className="text-sm text-earth-text-light mb-1">Verification Signature</p>
                    <p className="text-xs font-mono text-earth-text bg-earth-brown-50 p-2 rounded break-all">
                      {commitment.signature}
                    </p>
                    {commitment.timestamp && (
                      <p className="text-xs text-earth-text-light mt-1">
                        Verified at: {new Date(commitment.timestamp * 1000).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-earth-brown-200">
                  <div className="text-xs text-earth-text-light">
                    <p>Status: {
                      commitment.isCompleted 
                        ? (commitment.isVerified ? 'Completed & Verified' : 'Failed')
                        : 'Active'
                    }</p>
                  </div>
                  
                  {!commitment.isCompleted && new Date(commitment.deadline * 1000) > new Date() && (
                    <div className="flex space-x-2">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id={`proof-${commitment.id}`}
                        disabled={uploadingCommitmentId === commitment.id || verifyingCommitmentId === commitment.id}
                      />
                      <label
                        htmlFor={`proof-${commitment.id}`}
                        className={`px-4 py-2 rounded-md text-sm flex items-center gap-1 ${
                          uploadingCommitmentId === commitment.id || verifyingCommitmentId === commitment.id
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-earth-green-700 text-white hover:bg-earth-green-800 cursor-pointer'
                        }`}
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingCommitmentId === commitment.id ? 'Uploading...' : 'Upload Video'}
                      </label>
                      {proofFile && (
                        <button
                          onClick={() => handleProofUpload(commitment.id)}
                          disabled={uploadingCommitmentId === commitment.id || verifyingCommitmentId === commitment.id}
                          className={`px-4 py-2 rounded-md text-sm ${
                            uploadingCommitmentId === commitment.id || verifyingCommitmentId === commitment.id
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-earth-green-600 text-white hover:bg-earth-green-700'
                          }`}
                        >
                          {uploadingCommitmentId === commitment.id ? 'Uploading...' : 'Submit & Verify'}
                        </button>
                      )}
                      {commitment.videoId && !commitment.verificationInProgress && commitment.aiVerified === undefined && (
                        <button
                          onClick={() => handleVerification(commitment.id)}
                          disabled={verifyingCommitmentId === commitment.id}
                          className={`px-4 py-2 rounded-md text-sm ${
                            verifyingCommitmentId === commitment.id
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {verifyingCommitmentId === commitment.id ? 'Verifying...' : 'Verify Again'}
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
