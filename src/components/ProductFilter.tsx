import React from 'react'

type ProductFilterProps = {
  categories: string[]
  categorySubCategories: Record<string, string[]>
  selectedCategory: string
  selectedSubCategory: string
  onCategoryChange: (category: string) => void
  onSubCategoryChange: (subCategory: string) => void
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  categorySubCategories,
  selectedCategory,
  selectedSubCategory,
  onCategoryChange,
  onSubCategoryChange
}) => {
  const allSubCategories = Array.from(new Set(Object.values(categorySubCategories).flat()))

  const visibleCategories = selectedSubCategory
    ? Object.entries(categorySubCategories)
        .filter(([_, subCategories]) => subCategories.includes(selectedSubCategory))
        .map(([category]) => category)
    : categories

  const visibleSubCategories = selectedCategory !== 'All'
    ? categorySubCategories[selectedCategory]
    : allSubCategories

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Filter Products</h3>
      <div className="mb-4">
        <h4 className="text-md font-semibold mb-2">Categories</h4>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-full ${
              selectedCategory === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => onCategoryChange('All')}
          >
            All
          </button>
          {visibleCategories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-md font-semibold mb-2">Sub Categories</h4>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-full ${
              selectedSubCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => onSubCategoryChange('')}
          >
            All
          </button>
          {visibleSubCategories.map((subCategory) => (
            <button
              key={subCategory}
              className={`px-4 py-2 rounded-full ${
                selectedSubCategory === subCategory ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => onSubCategoryChange(subCategory)}
            >
              {subCategory}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductFilter