import React, { useState } from 'react'

export default function AuthPanel({ onAuth }) {
  const [isReg, setIsReg] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    if (!username || !password) {
      alert('Пайдаланушы аты мен құпия сөзді толтырыңыз')
      return
    }
    setLoading(true)
    setTimeout(() => {
      if (isReg) {
        if (localStorage.getItem(username)) {
          alert('Бұл пайдаланушы атымен тіркелген қолданушы бар')
        } else {
          const user = { username, password }
          localStorage.setItem(username, JSON.stringify(user))
          onAuth(user)
        }
      } else {
        const user = JSON.parse(localStorage.getItem(username))
        if (user && user.password === password) {
          onAuth(user)
        } else {
          alert('Қате: пайдаланушы аты немесе құпия сөз дұрыс емес')
        }
      }
      setLoading(false)
    }, 900)
  }

  return (
    <div className='w-full flex items-center justify-center min-h-screen px-2'>
      <div className='w-full max-w-xs xs:max-w-sm sm:max-w-md'>
        <h1 className='text-3xl xs:text-4xl sm:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-800 text-center'>
          🎮 Қош келдіңіз
        </h1>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col items-center bg-gray-800 p-4 xs:p-6 rounded-lg shadow-lg w-full dark:bg-gray-200'
        >
          <h2 className='text-xl xs:text-2xl sm:text-3xl font-bold mb-6 dark:text-black'>
            {isReg ? 'Тіркелу' : 'Кіру'}
          </h2>
          <input
            type='text'
            placeholder='Пайдаланушы аты'
            value={username}
            onChange={e => setUsername(e.target.value)}
            className='mb-4 p-2 xs:p-3 w-full rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-400 dark:focus:ring-blue-300 text-base xs:text-lg'
            disabled={loading}
          />
          <input
            type='password'
            placeholder='Құпия сөз'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='mb-6 p-2 xs:p-3 w-full rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-400 dark:focus:ring-blue-300 text-base xs:text-lg'
            disabled={loading}
          />
          <button
            type='submit'
            disabled={loading}
            className='px-4 xs:px-6 py-2 xs:py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition transform hover:scale-105 dark:bg-green-400 dark:hover:bg-green-500 w-full disabled:opacity-60 text-base xs:text-lg'
          >
            {loading ? 'Жүктелуде...' : isReg ? 'Тіркелу' : 'Кіру'}
          </button>
          <p
            onClick={() => !loading && setIsReg(r => !r)}
            className={`mt-4 text-blue-400 cursor-pointer hover:underline dark:text-blue-600 ${
              loading ? 'opacity-50 pointer-events-none' : ''
            } text-sm xs:text-base`}
          >
            {isReg ? 'Аккаунтыңыз бар ма? Кіру' : 'Аккаунтыңыз жоқ па? Тіркелу'}
          </p>
        </form>
      </div>
    </div>
  )
}
