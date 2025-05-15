import React from 'react'

export default function Search({
  value,
  onChange,
  placeholder = 'Ойын іздеу...',
}) {
  return (
    <input
      type='text'
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className='mb-8 px-6 py-4 rounded-2xl border border-gray-400 text-white dark:text-black bg-gray-900 dark:bg-white w-96 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
    />
  )
}
