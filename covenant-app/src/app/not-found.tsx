'use client'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-earth-green-50 to-earth-brown-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-earth-green-900 mb-4">404</h1>
        <p className="text-earth-text mb-8">Page not found</p>
        <a href="/" className="bg-earth-green-600 text-white px-6 py-3 rounded-md hover:bg-earth-green-700">
          Go Home
        </a>
      </div>
    </div>
  )
}
