'use client'

import { Target, Shield, DollarSign } from 'lucide-react'

export function Hero() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Commit to Your Goals
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Put your money where your mouth is. Stake ETH on completing your goals, 
          prove you did it, and get your money back. Fail, and your money goes to charity.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Set Your Goal</h3>
            <p className="text-gray-600">Define what you want to achieve and stake money on it</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Prove It</h3>
            <p className="text-gray-600">Submit video or photo evidence that you completed your goal</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <DollarSign className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Get Rewarded</h3>
            <p className="text-gray-600">Get your money back or donate it to a good cause</p>
          </div>
        </div>
      </div>
    </section>
  )
}
