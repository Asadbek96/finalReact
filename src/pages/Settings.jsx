import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  )
  const [sound, setSound] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className='max-w-xl w-full mx-auto bg-transparent dark:bg-gray-100 rounded-xl shadow-2xl p-6 mt-8'>
      <button
        onClick={() => navigate(-1)}
        className='mb-6 px-5 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition hover:scale-105 dark:bg-blue-400 dark:hover:bg-blue-500'
      >
        🔙 Артқа
      </button>
      <h2 className='text-2xl font-bold mb-4 text-blue-700'>Параметрлер</h2>
      <div className='flex flex-col gap-4'>
        <Checkbox
          checked={darkMode}
          onChange={() => setDarkMode(v => !v)}
          label='Жарық режим (Light mode)'
        />
        <Checkbox
          checked={sound}
          onChange={() => setSound(v => !v)}
          label='Дыбыс қосу (Sound on)'
        />
        <button
          className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
          onClick={() => alert('Сақталды!')}
        >
          Өзгерістерді сақтау
        </button>
      </div>
    </div>
  )
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label className='flex items-center gap-3'>
      <input
        type='checkbox'
        checked={checked}
        onChange={onChange}
        className='form-checkbox h-5 w-5 text-blue-600'
      />
      {label}
    </label>
  )
}
