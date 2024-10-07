import React, { useState } from 'react'
import ProductFilter from './ProductFilter'
import SearchBar from './SearchBar'
import { Heart } from 'lucide-react'

type Product = {
  id: number
  name: string
  price: number
  category: string
  subCategory: string
  sku: string
  description: string
  image: string
}

type FeaturedProductsProps = {
  products: Product[]
  categories: string[]
  categorySubCategories: Record<string, string[]>
  favorites: number[]
  toggleFavorite: (productId: number) => void
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  categories,
  categorySubCategories,
  favorites,
  toggleFavorite
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesSubCategory = selectedSubCategory === '' || product.subCategory === selectedSubCategory
    const matchesSearch = 
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toString().includes(searchTerm)
    
    return matchesCategory && matchesSubCategory && matchesSearch
  })

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category !== 'All' && !categorySubCategories[category].includes(selectedSubCategory)) {
      setSelectedSubCategory('')
    }
  }

  const handleSubCategoryChange = (subCategory: string) => {
    setSelectedSubCategory(subCategory)
    if (subCategory !== '' && selectedCategory !== 'All') {
      const categoryForSubCategory = Object.entries(categorySubCategories).find(
        ([_, subCategories]) => subCategories.includes(subCategory)
      )?.[0]
      if (categoryForSubCategory && categoryForSubCategory !== selectedCategory) {
        setSelectedCategory('All')
      }
    }
  }

  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Jewelry</h2>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <ProductFilter
          categories={categories}
          categorySubCategories={categorySubCategories}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          onCategoryChange={handleCategoryChange}
          onSubCategoryChange={handleSubCategoryChange}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">${product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
                <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
                <p className="text-sm text-gray-500 mb-2">Sub Category: {product.subCategory}</p>
                <p className="text-sm text-gray-500 mb-4">{product.description}</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
                  Add to Cart
                </button>
              </div>
              <button
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart
                  className={`w-6 h-6 ${
                    favorites.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturedProducts