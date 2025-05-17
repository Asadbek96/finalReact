import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaCog } from 'react-icons/fa'

const genres = [
  { label: 'Барлығы', value: 'all' },
  { label: 'Экшен', value: 'action' },
  { label: 'Логика', value: 'logic' },
  { label: 'Сөз', value: 'word' },
]

const sidebarGames = [
  { name: 'Flappy Bird', icon: '🐦', genre: 'action' },
  { name: 'Tic Tac Toe', icon: '❌⭕', genre: 'logic' },
  { name: 'Block Blast', icon: '🧱', genre: 'logic' },
  { name: 'Snake', icon: '🐍', genre: 'action' },
  { name: 'Memory Game', icon: '🧠', genre: 'logic' },
  { name: 'Word Guess', icon: '🔤', genre: 'word' },
]

export default function Sidebar({ selected, onSelect }) {
  const [selectedGenre, setSelectedGenre] = useState('all')

  const filteredGames =
    selectedGenre === 'all'
      ? sidebarGames
      : sidebarGames.filter(g => g.genre === selectedGenre)

  const genreButtonClass = active =>
    `px-2 py-1 rounded-lg text-xs font-semibold transition ${
      active
        ? 'bg-blue-500 text-white'
        : 'bg-gray-800/70 dark:bg-gray-200/70 text-gray-300 dark:text-gray-700 hover:bg-blue-700/80 hover:text-white'
    }`

  const gameButtonClass = active =>
    `group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 ${
      active
        ? 'bg-blue-500 text-white scale-110 shadow-xl ring-4 ring-blue-400/30'
        : 'bg-gray-800/70 dark:bg-gray-200/70 text-gray-300 dark:text-gray-700 hover:bg-blue-700/80 hover:text-white hover:scale-105'
    }`

  return (
    <aside
      className=' hidden md:block min-w-[70px] max-w-[150px]  w-16 sm:w-20 bg-gray-900 dark:bg-gray-200 flex flex-col items-center py-4 sm:py-8 shadow-2xl border-r border-blue-800 dark:border-blue-200
      fixed bottom-0 left-0 right-0 z-40 sm:static sm:h-auto sm:rounded-none
      flex-shrink-0
    '
    >
      <div className='flex flex-row sm:flex-col gap-2 mb-2 sm:mb-6'>
        {genres.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setSelectedGenre(value)}
            className={genreButtonClass(selectedGenre === value)}
          >
            <span className='hidden sm:inline'>{label}</span>
            <span className='sm:hidden'>{label[0]}</span>
          </button>
        ))}
      </div>
      <div className='flex flex-row sm:flex-col gap-2 sm:gap-4 mt-2 justify-center items-center'>
        {filteredGames.map((game, idx) => {
          const index = sidebarGames.findIndex(g => g.name === game.name)
          return (
            <button
              key={game.name}
              title={game.name}
              onClick={() => onSelect(index)}
              className={gameButtonClass(selected === index)}
              style={{ outline: 'none', border: 'none' }}
            >
              <span className='text-xl sm:text-2xl'>{game.icon}</span>
              <span className='absolute left-1/2 sm:left-14 top-12 sm:top-auto opacity-0 group-hover:opacity-100 bg-gray-700 text-white dark:bg-white dark:text-black px-2 sm:px-3 py-1 rounded-lg shadow-lg text-xs font-semibold pointer-events-none transition-all duration-200 whitespace-nowrap z-50'>
                {game.name}
              </span>
            </button>
          )
        })}
      </div>
      <div className='flex-1 hidden sm:block' />
      <div className='flex flex-row sm:flex-col gap-2 sm:gap-3  justify-start absolute left-5 items-start bottom-2'>
        <SidebarLink to='/profile' icon={<FaUser />} label='Профиль' />
        <SidebarLink to='/settings' icon={<FaCog />} label='Параметрлер' />
      </div>
      <div className='w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-400 opacity-30 blur-2xl mt-2 sm:mt-8' />
    </aside>
  )
}

function SidebarLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className='flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-800 dark:bg-gray-300 text-blue-400 dark:text-blue-700 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition shadow group'
    >
      <span className='text-lg sm:text-xl mb-0.5'>{icon}</span>
      <span className='text-[9px] sm:text-[10px] font-semibold group-hover:scale-110 transition'>
        {label}
      </span>
    </Link>
  )
}
