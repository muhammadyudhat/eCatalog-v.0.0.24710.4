import React from 'react'
import { Diamond, ShoppingCart, User, Heart, Users, Settings, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

type HeaderProps = {
  isAuthenticated: boolean;
  onLogout: () => void;
};

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Diamond className="w-8 h-8 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-gray-800">PondokLensa Jewelry</span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link></li>
            <li><Link to="/products" className="text-gray-600 hover:text-blue-600">Products</Link></li>
            {isAuthenticated && (
              <>
                <li><Link to="/product-management" className="text-gray-600 hover:text-blue-600">Product Management</Link></li>
                <li><Link to="/add-category" className="text-gray-600 hover:text-blue-600">Add Category</Link></li>
                <li><Link to="/favorites" className="text-gray-600 hover:text-blue-600">Favorites</Link></li>
                <li><Link to="/user-management" className="text-gray-600 hover:text-blue-600">User Management</Link></li>
                <li><Link to="/feature-management" className="text-gray-600 hover:text-blue-600">Feature Management</Link></li>
              </>
            )}
            <li><Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link></li>
            <li><Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/favorites">
                <Heart className="w-6 h-6 text-gray-600 cursor-pointer" />
              </Link>
              <ShoppingCart className="w-6 h-6 text-gray-600 cursor-pointer" />
              <User className="w-6 h-6 text-gray-600 cursor-pointer" />
              <Link to="/user-management">
                <Users className="w-6 h-6 text-gray-600 cursor-pointer" />
              </Link>
              <Link to="/feature-management">
                <Settings className="w-6 h-6 text-gray-600 cursor-pointer" />
              </Link>
              <LogOut className="w-6 h-6 text-gray-600 cursor-pointer" onClick={onLogout} />
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-gray-600 hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header