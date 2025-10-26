'use client'

import { useState } from 'react'

export function ApiTest() {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testUpload = async () => {
    setIsLoading(true)
    setTestResult('Testing upload API...')
    
    try {
      // Create a small test file
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
      const formData = new FormData()
      formData.append('file', testFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      if (response.ok) {
        setTestResult(`✅ Upload successful: ${JSON.stringify(result, null, 2)}`)
      } else {
        setTestResult(`❌ Upload failed: ${result.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testVerify = async () => {
    setIsLoading(true)
    setTestResult('Testing verify API...')
    
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: 'test-video-id',
          commitmentDescription: 'Test commitment',
          commitmentId: 1
        }),
      })

      const result = await response.json()
      
      if (response.ok) {
        setTestResult(`✅ Verify successful: ${JSON.stringify(result, null, 2)}`)
      } else {
        setTestResult(`❌ Verify failed: ${result.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
      <h3 className="font-bold mb-2">API Test</h3>
      <div className="space-y-2">
        <button
          onClick={testUpload}
          disabled={isLoading}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2"
        >
          Test Upload
        </button>
        <button
          onClick={testVerify}
          disabled={isLoading}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          Test Verify
        </button>
      </div>
      {testResult && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
          <pre className="whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  )
}
