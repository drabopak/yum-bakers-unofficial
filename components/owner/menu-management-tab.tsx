'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, X, AlertCircle, Loader2 } from 'lucide-react'
import { useMenuStore, type MenuRow } from '@/data/menu-store'
import { formatRs } from '@/components/cart/cart-context'

const CATEGORIES = [
  { id: 'cakes', label: 'Customized Cakes' },
  { id: 'mithai', label: 'Mithai & Sweets' },
  { id: 'chicken', label: 'Crispy Fried Chicken' },
  { id: 'dairy', label: 'Fresh Dairy & Honey' },
]

const inputClass =
  'w-full rounded-xl border border-amber-200 bg-amber-50/40 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-200'

type EditState = {
  id: string
  name: string
  description: string
  price: string
  category: string
  image: string
} | null

export function MenuManagementTab() {
  const { items, addItem, updateItem, deleteItem, toggleAvailable } = useMenuStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editing, setEditing] = useState<EditState>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const startEdit = (item: MenuRow) => {
    setEditing({
      id: item.id,
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      image: item.image,
    })
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const id = (form.get('id') as string).trim().toLowerCase().replace(/\s+/g, '-')
    const name = (form.get('name') as string).trim()
    const description = (form.get('description') as string).trim()
    const price = parseFloat(form.get('price') as string)
    const category = form.get('category') as string
    const image = (form.get('image') as string).trim()

    if (!id || !name || !description || !category || !image) {
      setError('All fields are required')
      return
    }
    if (isNaN(price) || price <= 0) {
      setError('Price must be a positive number')
      return
    }
    if (!/^https?:\/\/.+/.test(image) && !image.startsWith('/')) {
      setError('Image must be a valid URL or local path')
      return
    }

    setSaving(true)
    setError(null)
    const { error: err } = await addItem({ id, name, description, price, category, image })
    setSaving(false)
    if (err) {
      setError(err)
      return
    }
    setShowAddForm(false)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editing) return
    const price = parseFloat(editing.price)
    if (isNaN(price) || price <= 0) {
      setError('Price must be a positive number')
      return
    }
    if (!editing.name.trim() || !editing.description.trim() || !editing.image.trim()) {
      setError('All fields are required')
      return
    }
    if (!/^https?:\/\/.+/.test(editing.image) && !editing.image.startsWith('/')) {
      setError('Image must be a valid URL or local path')
      return
    }

    setSaving(true)
    setError(null)
    const { error: err } = await updateItem(editing.id, {
      name: editing.name.trim(),
      description: editing.description.trim(),
      price,
      category: editing.category,
      image: editing.image.trim(),
    })
    setSaving(false)
    if (err) {
      setError(err)
      return
    }
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    setSaving(true)
    const { error: err } = await deleteItem(id)
    setSaving(false)
    if (err) {
      setError(err)
      return
    }
    setConfirmDelete(null)
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-stone-800">Menu Items ({items.length})</h2>
        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-amber-700"
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5"
        >
          <h3 className="mb-4 font-serif text-base font-bold text-stone-800">New Product</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-stone-700">Product ID (slug)</span>
              <input name="id" required className={inputClass} placeholder="e.g. chocolate-cake" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-stone-700">Title</span>
              <input name="name" required className={inputClass} placeholder="Product name" />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-semibold text-stone-700">Description</span>
              <input name="description" required className={inputClass} placeholder="Short description" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-stone-700">Price (Rs.)</span>
              <input name="price" type="number" min="1" step="1" required className={inputClass} placeholder="0" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-stone-700">Category</span>
              <select name="category" required className={inputClass} defaultValue="">
                <option value="" disabled>Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-semibold text-stone-700">Image URL</span>
              <input name="image" type="url" required className={inputClass} placeholder="https://... or /images/..." />
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Save Product
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-amber-100 bg-amber-50/70 text-xs font-semibold uppercase tracking-wide text-amber-800">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-stone-500">
                    No menu items yet. Add your first product.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="align-middle transition-colors hover:bg-amber-50/50">
                    <td className="px-4 py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {editing?.id === item.id ? (
                        <input
                          value={editing.name}
                          onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                          className={inputClass}
                        />
                      ) : (
                        <div>
                          <p className="font-semibold text-stone-800">{item.name}</p>
                          <p className="text-xs text-stone-500 max-w-xs truncate">{item.description}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-600">
                      {editing?.id === item.id ? (
                        <select
                          value={editing.category}
                          onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                          className={inputClass}
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      ) : (
                        CATEGORIES.find((c) => c.id === item.category)?.label ?? item.category
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-stone-800">
                      {editing?.id === item.id ? (
                        <input
                          type="number"
                          min="1"
                          value={editing.price}
                          onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                          className={`${inputClass} w-24`}
                        />
                      ) : (
                        formatRs(item.price)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleAvailable(item.id, !item.is_available)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.is_available
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {item.is_available ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {item.is_available ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {editing?.id === item.id ? (
                        <div className="flex items-center gap-2">
                          {editing.id === item.id && (
                            <div className="flex flex-col gap-1">
                              <input
                                value={editing.description}
                                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                                className={inputClass}
                                placeholder="Description"
                              />
                              <input
                                value={editing.image}
                                onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                                className={inputClass}
                                placeholder="Image URL"
                              />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={handleUpdate as unknown as () => void}
                            disabled={saving}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Pencil className="h-3 w-3" />}
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditing(null)}
                            className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : confirmDelete === item.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={saving}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(null)}
                            className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                          >
                            <Pencil className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(item.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
