'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ secret }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Invalid secret')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 border p-6 rounded-lg">
      <h1 className="text-xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Enter admin secret"
          className="w-full border px-4 py-2 rounded"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Enter
        </button>
      </form>
    </div>
  )
}