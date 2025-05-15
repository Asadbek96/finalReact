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
      className='top-1  px-3 sm:py-2 bg-white text-black rounded-full shadow-lg hover:bg-white transition transform hover:scale-105 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
    >
      {darkMode ? '🌙 Қараңғы режим' : '☀️ Жарық режимі'}
    </button>
  )
}
