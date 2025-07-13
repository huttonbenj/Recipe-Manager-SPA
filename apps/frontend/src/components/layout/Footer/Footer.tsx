/**
 * Footer component
 * TODO: Implement footer with links and copyright
 */

import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 Recipe Manager. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer