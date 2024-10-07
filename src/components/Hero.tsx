import React from 'react'

const Hero = () => {
  return (
    <div className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">Discover Timeless Elegance</h1>
          <p className="text-xl mb-6">Explore our exquisite collection of fine jewelry for every occasion.</p>
          <button className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300">
            Shop Now
          </button>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
            alt="Jewelry Collection"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  )
}

export default Hero