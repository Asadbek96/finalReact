import React, { useState } from 'react'
import FlappyBird from './FlappyBird'
import TicTacToe from './TicTacToe'
import BlockBlast from './BlockBlast'
import SnakeGame from './SnakeGames'
import MemoryGame from './MemoryGame'
import WordGuessGame from './WordGuessGame'
import Search from './Search'
import { useSearch } from './SearchContext'

const games = [
  { name: 'Flappy Bird', component: <FlappyBird />, icon: '🐦' },
  { name: 'Tic Tac Toe', component: <TicTacToe />, icon: '❌⭕' },
  { name: 'Block Blast', component: <BlockBlast />, icon: '🧱' },
  { name: 'Snake', component: <SnakeGame />, icon: '🐍' },
  { name: 'Memory Game', component: <MemoryGame />, icon: '🧠' },
  { name: 'Word Guess', component: <WordGuessGame />, icon: '🔤' },
]

export default function GamesPanel({ selectedGame, setSelectedGame }) {
  const { search, setSearch } = useSearch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const filtered = games.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = idx => {
    setLoading(true)
    setError(null)
    setTimeout(() => {
      if (Math.random() < 0.15) {
        setError('Қате: Ойынды жүктеу сәтсіз аяқталды.')
        setLoading(false)
      } else {
        setSelectedGame(idx)
        setLoading(false)
      }
    }, 900)
  }

  if (loading)
    return (
      <div className='flex flex-col items-center justify-center min-h-[300px]'>
        <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-6'></div>
        <div className='text-xl text-blue-400 font-bold'>Жүктелуде...</div>
      </div>
    )

  if (error)
    return (
      <div className='flex flex-col items-center justify-center min-h-[300px]'>
        <div className='text-2xl text-red-400 font-bold mb-4'>{error}</div>
        <button
          onClick={() => setError(null)}
          className='px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition'
        >
          Қайталау
        </button>
      </div>
    )

  if (selectedGame !== null)
    return (
      <div className='flex flex-col items-center'>
        <button
          onClick={() => setSelectedGame(null)}
          className='mb-6 px-5 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition hover:scale-105 dark:bg-blue-400 dark:hover:bg-blue-500'
        >
          🔙 Артқа
        </button>
        {games[selectedGame].component}
      </div>
    )

  return (
    <div className='relative flex flex-col items-center w-full'>
      <h1 className='text-4xl sm:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 dark:from-blue-600 dark:to-purple-800 text-center'>
        🎮 Мини-ойындар
      </h1>
      <Search value={search} onChange={setSearch} />
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl'>
        {filtered.length ? (
          filtered.map(game => (
            <button
              key={game.name}
              onClick={() =>
                handleSelect(games.findIndex(g => g.name === game.name))
              }
              className='flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition hover:scale-105 dark:bg-gray-300 dark:hover:bg-gray-400'
            >
              <span className='text-3xl sm:text-4xl mb-1'>{game.icon}</span>
              <span className='text-sm sm:text-lg font-semibold text-center'>
                {game.name}
              </span>
            </button>
          ))
        ) : (
          <div className='col-span-full text-center text-gray-400'>
            Ойын табылмады
          </div>
        )}
      </div>
    </div>
  )
}
