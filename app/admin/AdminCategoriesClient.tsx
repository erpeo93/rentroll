'use client'

import { useState } from 'react'
import { ProductCategory, CategoryType } from '@prisma/client'
import { toast } from 'react-hot-toast'

type Props = {
  categories: ProductCategory[]
}

export default function AdminCategoryManager({ categories }: Props) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryType, setNewCategoryType] = useState<CategoryType>('ENTERTAINMENT')
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<string | null>(null)
  const [migrateToCategoryId, setMigrateToCategoryId] = useState<string | null>(null)

  async function handleCreate() {
    try {
      const res = await fetch('/api/admin/create-category', {
        method: 'POST',
        body: JSON.stringify({ name: newCategoryName, type: newCategoryType }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to create category')
      toast.success('Category created')
      setNewCategoryName('')
    } catch (err) {
      toast.error('Error creating category')
    }
  }

  async function handleDelete() {
    if (!selectedCategoryToDelete || !migrateToCategoryId) {
      toast.error('Please select both the category to delete and the target migration category')
      return
    }

    try {
      const res = await fetch(`/api/admin/delete-category/${selectedCategoryToDelete}`, {
        method: 'DELETE',
        body: JSON.stringify({ migrateToCategoryId }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to delete category')
      toast.success('Category deleted and products migrated')
      setSelectedCategoryToDelete(null)
      setMigrateToCategoryId(null)
    } catch (err) {
      toast.error('Error deleting category')
    }
  }

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-xl font-semibold">Manage Categories</h2>

      <div className="flex flex-col md:flex-row items-center gap-2">
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="border rounded px-3 py-1"
        />
        <select
          value={newCategoryType}
          onChange={(e) => setNewCategoryType(e.target.value as CategoryType)}
          className="border rounded px-3 py-1"
        >
          <option value="ENTERTAINMENT">ENTERTAINMENT</option>
          <option value="CONSUMABLE">CONSUMABLE</option>
        </select>
        <button onClick={handleCreate} className="bg-green-500 text-white px-3 py-1 rounded">
          Add Category
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-2">
        <select
          value={selectedCategoryToDelete ?? ''}
          onChange={(e) => setSelectedCategoryToDelete(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="">Select category to delete</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <span className="text-gray-500">→ migrate products to →</span>

        <select
          value={migrateToCategoryId ?? ''}
          onChange={(e) => setMigrateToCategoryId(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="">Select migration target</option>
          {categories
            .filter((cat) => cat.id !== selectedCategoryToDelete)
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>

        <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded">
          Delete Category
        </button>
      </div>
    </div>
  )
}