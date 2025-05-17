import React, { useEffect, useState } from 'react'

export default function DarkLightMode() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode')
    return stored ? JSON.parse(stored) : true
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className='px-2 py-1 xs:px-3 xs:py-2 sm:px-4 sm:py-2 bg-white text-black rounded-full shadow-lg hover:bg-white transition transform hover:scale-105 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 text-xs xs:text-sm sm:text-base font-semibold flex items-center gap-1'
    >
      <span>{darkMode ? '🌙' : '☀️'}</span>
      <span className='hidden xs:inline'>
        {darkMode ? 'Қараңғы режим' : 'Жарық режимі'}
      </span>
    </button>
  )
}
