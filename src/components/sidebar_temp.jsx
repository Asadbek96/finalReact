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
    <aside className='w-20 bg-gray-900 dark:bg-gray-200 flex flex-col items-center py-8 shadow-2xl border-r border-blue-800 dark:border-blue-200'>
     
      <div className='flex flex-col gap-2 mb-6'>
        {genres.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setSelectedGenre(value)}
            className={genreButtonClass(selectedGenre === value)}
          >
            {label}
          </button>
        ))}
      </div>
   
      <div className='flex flex-col gap-4 mt-2'>
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
              <span className='text-2xl'>{game.icon}</span>
              <span className='absolute left-14 opacity-0 group-hover:opacity-100 bg-gray-700 text-white dark:bg-white dark:text-black px-3 py-1 rounded-lg shadow-lg text-xs font-semibold pointer-events-none transition-all duration-200'>
                {game.name}
              </span>
            </button>
          )
        })}
      </div>
      <div className='flex-1' />

      <div className='flex flex-col gap-3 mb-4 w-full items-center'>
        <SidebarLink to='/profile' icon={<FaUser />} label='Профиль' />
        <SidebarLink to='/settings' icon={<FaCog />} label='Параметрлер' />
      </div>
      <div className='w-8 h-8 rounded-full bg-blue-400 opacity-30 blur-2xl mt-8' />
    </aside>
  )
}

function SidebarLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className='flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-gray-800 dark:bg-gray-300 text-blue-400 dark:text-blue-700 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition shadow group'
    >
      <span className='text-xl mb-1'>{icon}</span>
      <span className='text-[10px] font-semibold group-hover:scale-110 transition'>
        {label}
      </span>
    </Link>
  )
}
