import React, { useState, useEffect } from 'react'
import DarkLightMode from './components/DarkLightMode'
import Footer from './components/Footer'
import AppRouter from './AppRouter'
import { SearchProvider } from './components/SearchContext'
import Sidebar from './components/Sidebar'

function LogoutButton({ onLogout, loading }) {
  return (
    <button
      onClick={onLogout}
      className='px-2 py-1 xs:px-3 xs:py-2 sm:px-4 sm:py-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition dark:bg-red-400 dark:hover:bg-red-500 text-xs xs:text-sm sm:text-base font-semibold'
      disabled={loading}
    >
      <span className='hidden xs:inline'>
        {loading ? 'Шығуда...' : '🚪Шығу'}
      </span>
      <span className='inline xs:hidden'>{loading ? '...' : '🚪'}</span>
    </button>
  )
}

function LoadingScreen() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px]'>
      <div className='animate-spin rounded-full h-10 w-10 sm:h-16 sm:w-16 border-b-4 border-blue-500 mb-6'></div>
      <div className='text-base sm:text-xl text-blue-400 font-bold'>
        Жүктелуде...
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [loading, setLoading] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const handleLogout = () => {
    setLoading(true)
    setTimeout(() => {
      setUser(null)
      setLoading(false)
      setSelectedGame(null)
      localStorage.removeItem('user')
    }, 900)
  }

  return (
    <SearchProvider>
      <div className='flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 dark:text-black'>
        <div className='flex flex-1 w-full max-w-full'>
          {user && (
              <Sidebar selected={selectedGame} onSelect={setSelectedGame} />
            
          )}
          <div className='flex-1 flex flex-col relative w-full min-w-0'>
            <div className='fixed top-2 right-2 sm:top-6 sm:right-8 flex items-center gap-2 sm:gap-4 z-50'>
              <DarkLightMode />
              {user && (
                <LogoutButton onLogout={handleLogout} loading={loading} />
              )}
            </div>
            <div className='flex-1 flex flex-col items-center justify-center w-full px-2 py-2 sm:px-4 sm:py-6'>
              <div className='w-full max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl'>
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
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </SearchProvider>
  )
}
