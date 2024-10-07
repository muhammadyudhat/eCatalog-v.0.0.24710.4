import React from 'react'

type SearchBarProps = {
  searchTerm: string
  onSearchChange: (value: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder="Search by SKU, description, or price..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export default SearchBar