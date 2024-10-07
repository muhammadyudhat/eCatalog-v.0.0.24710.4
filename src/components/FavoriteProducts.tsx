import React from 'react'
import { Heart } from 'lucide-react'

type Product = {
  id: number
  name: string
  price: number
  category: string
  sku: string
  description: string
  image: string
}

type FavoriteProductsProps = {
  products: Product[]
  favorites: number[]
  toggleFavorite: (productId: number) => void
}

const FavoriteProducts: React.FC<FavoriteProductsProps> = ({ products, favorites, toggleFavorite }) => {
  const favoriteProducts = products.filter((product) => favorites.includes(product.id))

  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Your Favorite Jewelry</h2>
        {favoriteProducts.length === 0 ? (
          <p className="text-center text-gray-600">You haven't added any favorites yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">${product.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
                  <p className="text-sm text-gray-500 mb-4">{product.description}</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
                    Add to Cart
                  </button>
                </div>
                <button
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart className="w-6 h-6 text-red-500 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoriteProducts