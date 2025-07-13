/**
 * Header component with navigation and user menu
 * TODO: Implement header with logo, navigation, search, and auth menu
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks'

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary-600">
            Recipe Manager
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/recipes" className="nav-link">Recipes</Link>
            {isAuthenticated && (
              <Link to="/recipes/create" className="nav-link">Create Recipe</Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Hello, {user?.name || user?.email}</span>
                <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header