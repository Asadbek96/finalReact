import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile({ user }) {
  const navigate = useNavigate()

  const stats = user?.stats || []

  return (
    <div className='max-w-xl w-full mx-auto bg-transparent dark:bg-gray-100 rounded-xl shadow-2xl p-6 mt-8'>
      <button
        onClick={() => navigate(-1)}
        className='mb-6 px-5 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition hover:scale-105 dark:bg-blue-400 dark:hover:bg-blue-500'
      >
        🔙 Артқа
      </button>
      <h2 className='text-2xl font-bold mb-4 text-blue-700'>
        Профиль: {user?.username}
      </h2>
      <h3 className='text-lg font-semibold mb-2'>Статистика по играм:</h3>
      <StatsTable stats={stats} />
      <div className='text-gray-500 text-sm'>
        Барлығы ойындар: {stats.length}
      </div>
    </div>
  )
}

function StatsTable({ stats }) {
  return (
    <table className='w-full text-left mb-4'>
      <thead>
        <tr>
          <th className='py-2'>Ойын</th>
          <th className='py-2'>Ойнаған реті</th>
          <th className='py-2'>Ең үздік нәтиже</th>
        </tr>
      </thead>
      <tbody>
        {stats.length === 0 ? (
          <tr>
            <td colSpan={3} className='py-2 text-center text-gray-400'>
              Статистика жоқ
            </td>
          </tr>
        ) : (
          stats.map(game => (
            <tr key={game.name} className='border-t'>
              <td className='py-2'>{game.name}</td>
              <td className='py-2'>{game.played}</td>
              <td className='py-2'>{game.bestScore}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
