import React, { useState, useRef } from 'react'
import { PlusCircle, Upload, Edit, ToggleLeft, ToggleRight } from 'lucide-react'

type Product = {
  id: number
  name: string
  price: number
  category: string
  subCategory: string
  sku: string
  description: string
  image: string
  disabled: boolean
}

type ProductManagementProps = {
  products: Product[]
  categories: string[]
  categorySubCategories: Record<string, string[]>
  onAddProduct: (product: Omit<Product, 'id' | 'disabled'>) => void
  onEditProduct: (product: Product) => void
  onToggleProductStatus: (productId: number) => void
  onAddSubCategory: (category: string, subCategory: string) => void
}

const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  categories,
  categorySubCategories,
  onAddProduct,
  onEditProduct,
  onToggleProductStatus,
  onAddSubCategory,
}) => {
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'disabled'>>({
    name: '',
    price: 0,
    category: '',
    subCategory: '',
    sku: '',
    description: '',
    image: '',
  })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newSubCategory, setNewSubCategory] = useState('')
  const [selectedCategoryForSubCategory, setSelectedCategoryForSubCategory] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: name === 'price' ? parseFloat(value) : value })
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct) {
      onEditProduct(editingProduct)
      setEditingProduct(null)
    } else {
      onAddProduct(newProduct)
      setNewProduct({
        name: '',
        price: 0,
        category: '',
        subCategory: '',
        sku: '',
        description: '',
        image: '',
      })
    }
    setPreviewImage(null)
    setShowForm(false)
  }

  const handleAddSubCategory = () => {
    if (selectedCategoryForSubCategory && newSubCategory.trim() !== '') {
      onAddSubCategory(selectedCategoryForSubCategory, newSubCategory.trim())
      setNewSubCategory('')
      setSelectedCategoryForSubCategory('')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
        if (editingProduct) {
          setEditingProduct({ ...editingProduct, image: reader.result as string })
        } else {
          setNewProduct((prev) => ({ ...prev, image: reader.result as string }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setPreviewImage(product.image)
    setShowForm(true)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4 flex items-center"
        onClick={() => {
          setShowForm(!showForm)
          setEditingProduct(null)
          setPreviewImage(null)
        }}
      >
        <PlusCircle className="mr-2" />
        {showForm && !editingProduct ? 'Hide Form' : 'Add New Product'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label htmlFor="name" className="block mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editingProduct ? editingProduct.name : newProduct.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="price" className="block mb-1">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={editingProduct ? editingProduct.price : newProduct.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="category" className="block mb-1">Category</label>
            <select
              id="category"
              name="category"
              value={editingProduct ? editingProduct.category : newProduct.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subCategory" className="block mb-1">Sub Category</label>
            <select
              id="subCategory"
              name="subCategory"
              value={editingProduct ? editingProduct.subCategory : newProduct.subCategory}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select a sub category</option>
              {(editingProduct ? editingProduct.category : newProduct.category) &&
                categorySubCategories[(editingProduct ? editingProduct.category : newProduct.category)]?.map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="sku" className="block mb-1">SKU</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={editingProduct ? editingProduct.sku : newProduct.sku}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={editingProduct ? editingProduct.description : newProduct.description}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="image" className="block mb-1">Image</label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={triggerFileInput}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center"
              >
                <Upload className="mr-2" />
                Browse Image
              </button>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
              />
              {previewImage && (
                <img src={previewImage} alt="Preview" className="w-24 h-24 object-cover rounded-md" />
              )}
            </div>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Product List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Sub Category</th>
                <th className="px-4 py-2 border">SKU</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className={product.disabled ? 'bg-gray-200' : ''}>
                  <td className="px-4 py-2 border">{product.name}</td>
                  <td className="px-4 py-2 border">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{product.category}</td>
                  <td className="px-4 py-2 border">{product.subCategory}</td>
                  <td className="px-4 py-2 border">{product.sku}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="mr-2 p-1 bg-blue-500 text-white rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onToggleProductStatus(product.id)}
                      className={`p-1 ${product.disabled ? 'bg-green-500' : 'bg-red-500'} text-white rounded`}
                    >
                      {product.disabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Add New Sub Category</h3>
        <div className="flex space-x-2">
          <select
            value={selectedCategoryForSubCategory}
            onChange={(e) => setSelectedCategoryForSubCategory(e.target.value)}
            className="flex-grow px-3 py-2 border rounded-md"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            className="flex-grow px-3 py-2 border rounded-md"
            placeholder="Enter new sub category"
          />
          <button
            onClick={handleAddSubCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add Sub Category
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductManagement