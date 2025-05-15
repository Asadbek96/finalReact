import React, { useState } from 'react'
import DarkLightMode from './components/DarkLightMode'
import Footer from './components/Footer'
import AppRouter from './AppRouter'
import { SearchProvider } from './components/SearchContext'
import Sidebar from './components/Sidebar'

function LogoutButton({ onLogout, loading }) {
  return (
    <button
      onClick={onLogout}
      className='px-4 py-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition dark:bg-red-400 dark:hover:bg-red-500'
      disabled={loading}
    >
      {loading ? 'Шығуда...' : '🚪Шығу'}
    </button>
  )
}

function LoadingScreen() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[300px]'>
      <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-6'></div>
      <div className='text-xl text-blue-400 font-bold'>Жүктелуде...</div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)

  const handleLogout = () => {
    setLoading(true)
    setTimeout(() => {
      setUser(null)
      setLoading(false)
      setSelectedGame(null)
    }, 900)
  }

  return (
    <SearchProvider>
      <div className='flex min-h-screen'>
        {user && <Sidebar selected={selectedGame} onSelect={setSelectedGame} />}
        <div className='flex-1 flex flex-col relative'>
          <div className='fixed top-6 right-8 flex items-center gap-4 z-50'>
            <DarkLightMode />
            {user && <LogoutButton onLogout={handleLogout} loading={loading} />}
          </div>
          <div className='flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 dark:text-black p-4 sm:p-6'>
            {loading ? (
              <LoadingScreen />
            ) : (
              <AppRouter
                user={user}
                setUser={setUser}
                selectedGame={selectedGame}
                setSelectedGame={setSelectedGame}
              />
            )}
          </div>
          <Footer />
        </div>
      </div>
    </SearchProvider>
  )
}
