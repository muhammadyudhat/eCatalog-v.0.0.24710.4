import React, { useState } from 'react'

type AddCategoryProps = {
  categories: string[]
  onAddCategory: (category: string) => void
}

const AddCategory: React.FC<AddCategoryProps> = ({ categories, onAddCategory }) => {
  const [newCategory, setNewCategory] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCategory.trim() !== '') {
      onAddCategory(newCategory.trim())
      setNewCategory('')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-grow px-3 py-2 border rounded-l-md"
            placeholder="Enter new category"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md"
          >
            Add Category
          </button>
        </div>
      </form>
      <div>
        <h3 className="text-xl font-bold mb-2">Existing Categories</h3>
        <ul className="list-disc list-inside">
          {categories.map((category, index) => (
            <li key={index}>{category}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AddCategory