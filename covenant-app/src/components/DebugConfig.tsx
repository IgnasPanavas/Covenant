'use client'

import { useState } from 'react'

export function DebugConfig() {
  const [showDebug, setShowDebug] = useState(false)

  const checkConfig = async () => {
    try {
      // Test upload endpoint
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: new FormData() // Empty form data to trigger error
      })
      
      const uploadError = await uploadResponse.json()
      console.log('Upload API Error:', uploadError)
      
      // Test verify endpoint
      const verifyResponse = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: 'test',
          commitmentDescription: 'test',
          commitmentId: 1
        })
      })
      
      const verifyError = await verifyResponse.json()
      console.log('Verify API Error:', verifyError)
      
      alert(`Upload Error: ${uploadError.error}\nVerify Error: ${verifyError.error}`)
    } catch (error) {
      console.error('Debug check failed:', error)
      alert(`Debug check failed: ${error}`)
    }
  }

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-2 rounded text-xs"
      >
        Debug Config
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg max-w-md">
      <h3 className="font-bold mb-2">Debug Configuration</h3>
      <p className="text-sm mb-2">Check if API endpoints are properly configured:</p>
      <button
        onClick={checkConfig}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2"
      >
        Test APIs
      </button>
      <button
        onClick={() => setShowDebug(false)}
        className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
      >
        Close
      </button>
    </div>
  )
}
