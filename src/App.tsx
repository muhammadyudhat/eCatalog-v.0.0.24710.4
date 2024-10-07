import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import FeaturedProducts from './components/FeaturedProducts'
import ProductManagement from './components/ProductManagement'
import UserManagement from './components/UserManagement'
import FeatureManagement from './components/FeatureManagement'
import Footer from './components/Footer'
import AddCategory from './components/AddCategory'
import FavoriteProducts from './components/FavoriteProducts'
import Login from './components/Login'
import Register from './components/Register'

// Define types
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

type User = {
  id: number
  username: string
  email: string
  role: 'admin' | 'manager' | 'user'
}

type Feature = {
  id: number
  name: string
  description: string
  permissions: {
    admin: boolean
    manager: boolean
    user: boolean
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categorySubCategories, setCategorySubCategories] = useState<Record<string, string[]>>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }

    // Fetch products
    fetchProducts();

    // Fetch categories and sub-categories
    fetchCategories();

    // Load dummy data for users and features
    setUsers([
      {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        role: "admin"
      },
      // Add more dummy users here
    ]);

    setFeatures([
      {
        id: 1,
        name: "Product Management",
        description: "Manage products in the store",
        permissions: {
          admin: true,
          manager: true,
          user: false
        }
      },
      // Add more dummy features here
    ]);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        
        // Fetch sub-categories for each category
        const subCategoriesPromises = data.map(async (category: string) => {
          const subResponse = await fetch(`http://localhost:3001/api/categories/${category}/subcategories`);
          if (subResponse.ok) {
            const subData = await subResponse.json();
            return { [category]: subData };
          }
          return { [category]: [] };
        });

        const subCategoriesResults = await Promise.all(subCategoriesPromises);
        const newCategorySubCategories = Object.assign({}, ...subCategoriesResults);
        setCategorySubCategories(newCategorySubCategories);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleToggleFavorite = (productId: number) => {
    setFavorites(prevFavorites => 
      prevFavorites.includes(productId)
        ? prevFavorites.filter(id => id !== productId)
        : [...prevFavorites, productId]
    );
  };

  const handleAddProduct = async (product: Omit<Product, 'id' | 'disabled'>) => {
    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        const editedProduct = await response.json();
        setProducts(products.map(p => p.id === editedProduct.id ? editedProduct : p));
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleToggleProductStatus = async (productId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}/toggle`, {
        method: 'PATCH',
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      } else {
        console.error('Failed to toggle product status');
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
      setCategorySubCategories({...categorySubCategories, [category]: []});
    }
  };

  const handleAddSubCategory = async (category: string, subCategory: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/categories/${category}/subcategories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subCategory }),
      });

      if (response.ok) {
        setCategorySubCategories(prev => ({
          ...prev,
          [category]: [...(prev[category] || []), subCategory]
        }));
      } else {
        console.error('Failed to add sub-category');
      }
    } catch (error) {
      console.error('Error adding sub-category:', error);
    }
  };

  const handleAddUser = (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: users.length + 1
    };
    setUsers([...users, newUser]);
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleUpdateFeature = (updatedFeature: Feature) => {
    setFeatures(features.map(f => f.id === updatedFeature.id ? updatedFeature : f));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <FeaturedProducts
                  products={products.filter(p => !p.disabled)}
                  categories={categories}
                  categorySubCategories={categorySubCategories}
                  favorites={favorites}
                  toggleFavorite={handleToggleFavorite}
                />
              </>
            } />
            <Route path="/product-management" element={
              isAuthenticated ? (
                <ProductManagement
                  products={products}
                  categories={categories}
                  categorySubCategories={categorySubCategories}
                  onAddProduct={handleAddProduct}
                  onEditProduct={handleEditProduct}
                  onToggleProductStatus={handleToggleProductStatus}
                  onAddSubCategory={handleAddSubCategory}
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/add-category" element={
              isAuthenticated ? (
                <AddCategory
                  categories={categories}
                  onAddCategory={handleAddCategory}
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/favorites" element={
              isAuthenticated ? (
                <FavoriteProducts
                  products={products.filter(p => !p.disabled)}
                  favorites={favorites}
                  toggleFavorite={handleToggleFavorite}
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/user-management" element={
              isAuthenticated ? (
                <UserManagement
                  users={users}
                  onAddUser={handleAddUser}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/feature-management" element={
              isAuthenticated ? (
                <FeatureManagement
                  features={features}
                  onUpdateFeature={handleUpdateFeature}
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App