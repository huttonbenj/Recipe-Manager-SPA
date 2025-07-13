/**
 * Home page component
 * TODO: Implement homepage with hero section and featured recipes
 */

import React from 'react'

const Home: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to Recipe Manager</h1>
      <p className="text-center text-gray-600">Discover, create, and manage your favorite recipes</p>
    </div>
  )
}

export default Home