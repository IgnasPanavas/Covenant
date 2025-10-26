'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function HowItWorks() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const steps = [
    {
      number: 1,
      title: "Create Your Commitment",
      description: "Define your goal, set a deadline, and stake USDC or ETH. Choose a beneficiary who receives your stake if you fail to complete your commitment.",
      details: "Connect your wallet (MetaMask or any WalletConnect compatible wallet) and specify your commitment details. You'll need to have either USDC or ETH in your wallet to stake. The minimum stake is 0.000001 tokens. Your staked funds are held securely in a smart contract on Base Sepolia until the commitment is resolved."
    },
    {
      number: 2,
      title: "Complete Your Goal",
      description: "Work on achieving your commitment before the deadline. Keep track of your progress and be ready to provide proof of completion.",
      details: "As you work toward your goal, document your progress. When you're ready to prove completion, you'll upload a video showing that you've fulfilled your commitment. Make sure your video clearly demonstrates achievement of the stated goal."
    },
    {
      number: 3,
      title: "Upload Proof Video",
      description: "Upload a video demonstrating that you've completed your commitment. Our platform will process and verify your submission.",
      details: "Simply click 'Upload Video' on your active commitment, select your proof video, and submit. The video will be uploaded to our secure storage for AI verification. Supported formats include MP4, MOV, and other common video formats."
    },
    {
      number: 4,
      title: "AI-Powered Verification",
      description: "Our advanced AI analyzes your video to verify completion of your commitment, checking if the goal was achieved and if you are present in the video.",
      details: "Using cutting-edge AI vision technology, the system automatically analyzes your uploaded video to verify that: (1) you are present in the video, (2) your commitment goal has been clearly demonstrated, and (3) the evidence is sufficient. This process typically completes within seconds and provides detailed feedback on the verification result."
    },
    {
      number: 5,
      title: "Resolution",
      description: "If verified, you receive your stake back. If not verified or no proof is submitted by the deadline, your stake is sent to your chosen beneficiary.",
      details: "Upon successful AI verification, your staked funds are automatically returned to your wallet. If verification fails or no proof is submitted before the deadline, the funds are automatically transferred to the beneficiary address you specified when creating the commitment. All transactions are transparent and visible on the Base Sepolia blockchain."
    }
  ]

  return (
    <section className="py-20 bg-earth-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-earth-green-900 mb-16">
          How It Works
        </h2>
        
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.number} className="bg-earth-brown-50 rounded-lg p-6 border border-earth-brown-200">
              <button
                onClick={() => setExpandedStep(expandedStep === step.number ? null : step.number)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-earth-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-earth-green-900">{step.title}</h3>
                    <p className="text-earth-text-light">{step.description}</p>
                  </div>
                </div>
                {expandedStep === step.number ? (
                  <ChevronUp className="h-5 w-5 text-earth-green-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-earth-green-600" />
                )}
              </button>
              
              {expandedStep === step.number && (
                <div className="mt-4 pl-12">
                  <p className="text-earth-text">{step.details}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
