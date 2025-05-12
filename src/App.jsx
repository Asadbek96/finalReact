import React, { useState, useEffect } from 'react'
import FlappyBird from './components/FlappyBird'
import TicTacToe from './components/TicTacToe'
import BlockBlast from './components/BlockBlast'
import Snake from './components/Snake'
import MemoryGame from './components/MemoryGame'
import WordGuess from './components/WordGuess'
import Footer from './components/Footer'

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null)
  const [user, setUser] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)

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

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const games = [
    { name: 'Flappy Bird', component: <FlappyBird />, icon: '🐦' },
    { name: 'Tic Tac Toe', component: <TicTacToe />, icon: '❌⭕' },
    { name: 'Block Blast', component: <BlockBlast />, icon: '🧱' },
    { name: 'Snake', component: <Snake />, icon: '🐍' },
    { name: 'Memory Game', component: <MemoryGame />, icon: '🧠' },
    { name: 'Word Guess', component: <WordGuess />, icon: '🔤' },
  ]

  const handleLogin = (username, password) => {
    const storedUser = JSON.parse(localStorage.getItem(username))
    if (storedUser && storedUser.password === password) {
      setUser(storedUser)
    } else {
      alert('Қате: пайдаланушы аты немесе құпия сөз дұрыс емес')
    }
  }

  const handleRegister = (username, password) => {
    if (localStorage.getItem(username)) {
      alert('Бұл пайдаланушы атымен тіркелген қолданушы бар')
    } else {
      const newUser = { username, password }
      localStorage.setItem(username, JSON.stringify(newUser))
      setUser(newUser)
    }
  }

  const handleLogout = () => setUser(null)

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className='relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 dark:text-black p-4 sm:p-6'>
        <button
          onClick={toggleDarkMode}
          className='absolute top-4 left-4 px-3 py-2 sm:px-4 sm:py-2 bg-yellow-500 text-black rounded-full shadow-lg hover:bg-yellow-600 transition transform hover:scale-105 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
        >
          {darkMode ? '☀️ Жарық режимі' : '🌙 Қараңғы режим'}
        </button>

        {user ? (
          <>
            {selectedGame !== null ? (
              <>
                <button
                  onClick={() => setSelectedGame(null)}
                  className='mb-6 px-5 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-105 dark:bg-blue-400 dark:hover:bg-blue-500'
                >
                  🔙 Артқа
                </button>
                {games[selectedGame].component}
              </>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className='absolute top-4 right-4 px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition transform hover:scale-105 dark:bg-red-400 dark:hover:bg-red-500'
                >
                  🚪 Шығу
                </button>
                <h1 className='text-4xl sm:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-800 text-center'>
                  🎮 Мини-ойындар
                </h1>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl'>
                  {games.map((game, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedGame(index)}
                      className='flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition transform hover:scale-105 dark:bg-gray-300 dark:hover:bg-gray-400'
                    >
                      <span className='text-3xl sm:text-4xl mb-1'>
                        {game.icon}
                      </span>
                      <span className='text-sm sm:text-lg font-semibold text-center'>
                        {game.name}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className='w-full max-w-md'>
            <h1 className='text-4xl sm:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-800 text-center'>
              🎮 Қош келдіңіз
            </h1>
            {isRegistering ? (
              <AuthForm
                title='Тіркелу'
                onSubmit={handleRegister}
                toggleMode={() => setIsRegistering(false)}
                buttonText='Тіркелу'
                toggleText='Аккаунтыңыз бар ма? Кіру'
              />
            ) : (
              <AuthForm
                title='Кіру'
                onSubmit={handleLogin}
                toggleMode={() => setIsRegistering(true)}
                buttonText='Кіру'
                toggleText='Аккаунтыңыз жоқ па? Тіркелу'
              />
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

function AuthForm({ title, onSubmit, toggleMode, buttonText, toggleText }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(username, password)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm dark:bg-gray-200'
    >
      <h2 className='text-2xl sm:text-3xl font-bold mb-6 dark:text-black'>
        {title}
      </h2>
      <input
        type='text'
        placeholder='Пайдаланушы аты'
        value={username}
        onChange={e => setUsername(e.target.value)}
        className='mb-4 p-3 w-full rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-400 dark:focus:ring-blue-300'
      />
      <input
        type='password'
        placeholder='Құпия сөз'
        value={password}
        onChange={e => setPassword(e.target.value)}
        className='mb-6 p-3 w-full rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-400 dark:focus:ring-blue-300'
      />
      <button
        type='submit'
        className='px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition transform hover:scale-105 dark:bg-green-400 dark:hover:bg-green-500 w-full'
      >
        {buttonText}
      </button>
      <p
        onClick={toggleMode}
        className='mt-4 text-blue-400 cursor-pointer hover:underline dark:text-blue-600'
      >
        {toggleText}
      </p>
    </form>
  )
}
