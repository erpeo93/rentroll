'use client';

import { Product, ProductCategory  } from '@prisma/client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from "next/router";

interface AdminProductsClientProps {
  initialProducts: Product[];
  categories: { id: string; name: string }[];
}

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageDropzoneProps {
  onUpload: (url: string) => void; // callback after upload success
}

export function ImageDropzone({ onUpload }: ImageDropzoneProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Prepare form data for your API
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.url) {
        onUpload(data.url);
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload error');
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-6 text-center cursor-pointer ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here ...</p>
      ) : (
        <p>Drag 'n' drop an image here, or click to select</p>
      )}
    </div>
  );
}



export default function AdminProductsClient({ initialProducts, categories  }: AdminProductsClientProps) {

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    quantity: 0,
    description: '',
    imageUrl: '',
    price: 10,
    categoryId: '',
    secondaryImagesRaw: '',
    bulletPointsRaw: '',
    moodTagsRaw: '',
  minPlayers: '',
  maxPlayers: '',
  });

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        quantity: editingProduct.quantity,
        description: editingProduct.description || '',
        imageUrl: editingProduct.imageUrl || '',
        price: Number(editingProduct.price),
        categoryId: editingProduct.categoryId,
        secondaryImagesRaw: (editingProduct.secondaryImages || []).join('\n'),
        bulletPointsRaw: (editingProduct.bulletPoints || []).join('\n'),
        moodTagsRaw: (editingProduct.moodTags || []).join('\n'),
minPlayers: editingProduct.minPlayers?.toString() || '',
maxPlayers: editingProduct.maxPlayers?.toString() || '',
      });
    } else {
      setForm({ name: '', quantity: 0, description: '', imageUrl: '', price: 10, categoryId: '', secondaryImagesRaw: '', bulletPointsRaw: '', moodTagsRaw: '', minPlayers: '', maxPlayers: '' });
    }
  }, [editingProduct]);

  const handleChange = (field: string, value: any) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleImageUpload = (url: string) => {
    // Update the product image URL state
    //setCurrentProduct({ ...currentProduct, imageUrl: url });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/delete-product/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  const fetchProducts = async () => {
    const res = await axios.get('/api/admin/products');
    setProducts(res.data);
  };

  const saveProduct = async () => {
  const payload = {
    ...form,
    minPlayers: form.minPlayers ? parseInt(form.minPlayers) : null,
    maxPlayers: form.maxPlayers ? parseInt(form.maxPlayers) : null,
    secondaryImages: form.secondaryImagesRaw
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean),
    bulletPoints: form.bulletPointsRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    moodTags: form.moodTagsRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
  };

    if (editingProduct) {
      await axios.put(`/api/admin/products/${editingProduct.id}`, payload);
    } else {
      await axios.post('/api/admin/products', payload);
    }
    setEditingProduct(null);
    fetchProducts();
  };

const handleEditClick = (product: Product) => {
  setEditingProduct(product);
};

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Product Management</h1>

      <div className="mb-8">
        <button
          onClick={() => setEditingProduct(null)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add New Product
        </button>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
        <div className="space-y-4 max-w-md">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full border p-2 rounded"
          />
  <label className="block mt-2">
    Category:
    <select
      className="border p-2 w-full"
      value={form.categoryId}
      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
    >
      <option value="">Select category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  </label>
          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            className="w-full border p-2 rounded"
          />


          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            step="0.01"
            value={form.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
          />

<textarea
  placeholder="One image URL per line"
  value={form.secondaryImagesRaw}
  onChange={(e) => handleChange('secondaryImagesRaw', e.target.value)}
  rows={5}
  className="w-full border p-2 rounded"
/>

<label className="block mt-4">
  <span className="block mb-1 font-medium">Bullet Points (one per line)</span>
  <textarea
    value={form.bulletPointsRaw}
    onChange={(e) => handleChange('bulletPointsRaw', e.target.value)}
    placeholder="e.g. Great for groups\nEasy to learn\n90 minutes playtime"
    rows={4}
    className="w-full border p-2 rounded"
  />
</label>

<label className="block mt-4">
  <span className="block mb-1 font-medium">Mood Tags (one per line)</span>
  <textarea
    value={form.moodTagsRaw}
    onChange={(e) => handleChange('moodTagsRaw', e.target.value)}
    placeholder="e.g. Great for groups\nEasy to learn\n90 minutes playtime"
    rows={4}
    className="w-full border p-2 rounded"
  />
</label>

<div className="grid grid-cols-2 gap-4 mt-4">
  <label>
    <span className="block mb-1 font-medium">Min Players</span>
    <input
      type="number"
      value={form.minPlayers}
      onChange={(e) => handleChange('minPlayers', e.target.value)}
      className="w-full border p-2 rounded"
      min={0}
    />
  </label>
  <label>
    <span className="block mb-1 font-medium">Max Players</span>
    <input
      type="number"
      value={form.maxPlayers}
      onChange={(e) => handleChange('maxPlayers', e.target.value)}
      className="w-full border p-2 rounded"
      min={0}
    />
  </label>
</div>
          <button onClick={saveProduct} className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
          {editingProduct && (
            <button onClick={() => setEditingProduct(null)} className="ml-2 text-red-600 underline">
              Cancel
            </button>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Products</h2>
        <ul className="space-y-2">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex justify-between border p-3 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => handleEditClick(p)}
            >
              <div>
                <strong>{p.name}</strong> (Qty: {p.quantity}) — €{Number(p.price).toFixed(2)}
                <div className="text-sm text-gray-600">{p.description}</div>
              </div>
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.name} className="h-12 w-12 object-cover rounded" />
              )}

<button
            disabled={deletingId === p.id}
            onClick={() => handleDelete(p.id)}
            className="ml-4 px-2 py-1 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
          >
            {deletingId === p.id ? 'Deleting...' : 'Delete'}
          </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}