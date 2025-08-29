'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

type IntentDTO = {
  id: string
  city?: string | null
  address?: string | null
  deliveryWindowStart: string
  deliveryWindowEnd?: string | null
  deliveryFee? : number | null
  email?: string | null
  phone?: string | null
  products: { productId: string; name: string; quantity: number; price: number }[]
}

export default function UpcomingOrdersSection() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [intents, setIntents] = useState<IntentDTO[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchIntents()
  }, [])

  const fetchIntents = async () => {
    setLoading(true)
    try {
      const res = await axios.get<IntentDTO[]>('/api/admin/upcoming-orders')
      setIntents(res.data)
    } finally {
      setLoading(false)
    }
  }

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const copy = new Set(prev)
      if (copy.has(id)) copy.delete(id)
      else copy.add(id)
      return copy
    })
  }

  const totalValue = (products: IntentDTO['products']) =>
    products.reduce((sum, p) => sum + p.quantity * Number(p.price), 0)

  return (
    <div className="space-y-4">
      {loading && <p>Loading...</p>}
      {intents.map((intent) => (
        <div key={intent.id} className="border rounded shadow-sm">
          <button
            className="w-full text-left px-4 py-2 bg-gray-100 font-semibold"
            onClick={() => toggle(intent.id)}
          >
            {intent.city || '—'} • {intent.address || '—'} • {new Date(intent.deliveryWindowStart).toLocaleString()} — Total €{(totalValue(intent.products) + (intent.deliveryFee || 0)).toFixed(2)}
            <span className="float-right">{openIds.has(intent.id) ? '▲' : '▼'}</span>
          </button>
          {openIds.has(intent.id) && (
            <div className="p-4 bg-white">
              <p>Email: {intent.email || '—'}</p>
              <p>Phone: {intent.phone || '—'}</p>
              <p>DeliveryFee: {intent.deliveryFee || '—'}</p>
              <table className="w-full text-sm border mt-2">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border px-2 py-1">Product</th>
                    <th className="border px-2 py-1">Qty</th>
                    <th className="border px-2 py-1">Unit Price</th>
                    <th className="border px-2 py-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {intent.products.map((p) => (
                    <tr key={p.productId}>
                      <td className="border px-2 py-1">{p.name}</td>
                      <td className="border px-2 py-1 text-center">{p.quantity}</td>
                      <td className="border px-2 py-1 text-right">€{Number(p.price).toFixed(2)}</td>
                      <td className="border px-2 py-1 text-right">
                        €{(p.quantity * Number(p.price)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td colSpan={3} className="border px-2 py-1 text-right">Order Total:</td>
                    <td className="border px-2 py-1 text-right">
                      €{(totalValue(intent.products) + (intent.deliveryFee || 0)).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
      {intents.length === 0 && !loading && <p>No upcoming orders found.</p>}
    </div>
  )
}