'use client'

import { Target, Shield, DollarSign } from 'lucide-react'

export function Hero() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-earth-green-900 mb-6">
          Bet on Yourself. Literally.
        </h1>
        <p className="text-xl text-earth-text mb-12 max-w-3xl mx-auto">
          A Decentralized Agentic AI-Powered Accountability Platform to keep you pushing towards your goals.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-earth-brown-50 p-6 rounded-lg shadow-md border border-earth-brown-200">
            <Target className="h-12 w-12 text-earth-green-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-earth-green-900">Set Your Goal</h3>
            <p className="text-earth-text-light">Define what you want to achieve and stake money on it</p>
          </div>
          
          <div className="bg-earth-brown-50 p-6 rounded-lg shadow-md border border-earth-brown-200">
            <Shield className="h-12 w-12 text-earth-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-earth-green-900">Prove It</h3>
            <p className="text-earth-text-light">Submit video or photo evidence that you completed your goal</p>
          </div>
          
          <div className="bg-earth-brown-50 p-6 rounded-lg shadow-md border border-earth-brown-200">
            <DollarSign className="h-12 w-12 text-earth-brown-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-earth-green-900">Get Rewarded</h3>
            <p className="text-earth-text-light">Get your money back or donate it to a good cause</p>
          </div>
        </div>
      </div>
    </section>
  )
}
