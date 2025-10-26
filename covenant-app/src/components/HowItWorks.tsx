'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export function HowItWorks() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const steps = [
    {
      number: 1,
      title: "Create a Commitment",
      description: "Describe your goal, set a deadline, and stake ETH. Choose who gets your money if you fail.",
      details: "You'll need to connect your wallet and have some ETH to stake. The minimum stake is 0.01 ETH."
    },
    {
      number: 2,
      title: "Complete Your Goal",
      description: "Work on your goal before the deadline. Take photos or videos as proof.",
      details: "Make sure to document your progress with clear evidence that can be verified."
    },
    {
      number: 3,
      title: "Submit Proof",
      description: "Upload your evidence (photos/videos) to IPFS and submit the hash to the smart contract.",
      details: "Your proof is stored on IPFS (decentralized storage) and linked to your commitment."
    },
    {
      number: 4,
      title: "Verification",
      description: "Your proof is verified by our community or AI system within 7 days.",
      details: "If verified, you get your money back. If not verified or no proof submitted, your money goes to the beneficiary."
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
