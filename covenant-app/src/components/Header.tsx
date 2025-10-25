'use client'

import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Shield } from 'lucide-react'

export function Header() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Covenant</h1>
          </div>
          {mounted && <ConnectButton />}
        </div>
      </div>
    </header>
  )
}
