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
      className='mb-6 xs:mb-8 px-3 py-2 xs:px-4 xs:py-3 sm:px-6 sm:py-4 rounded-2xl border border-gray-400 text-white dark:text-black bg-gray-900 dark:bg-white w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg text-base xs:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors'
    />
  )
}
