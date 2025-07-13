/**
 * Input component with validation states
 * TODO: Implement input component with error handling and variants
 */

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

const Input: React.FC<InputProps> = ({ error, label, ...props }) => {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input className={`input ${error ? 'input-error' : ''}`} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Input