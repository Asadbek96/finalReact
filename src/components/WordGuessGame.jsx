import React, { useState, useEffect } from 'react'

export default function WordGuessGame() {
  const [secret, setSecret] = useState('')
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState([])
  const [started, setStarted] = useState(false)

  // Адаптивные размеры клетки
  function getCellSize() {
    const w = window.innerWidth
    if (w < 480) return 36
    if (w < 768) return 44
    return 48
  }
  const [cellSize, setCellSize] = useState(getCellSize())

  useEffect(() => {
    const onResize = () => setCellSize(getCellSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const onKey = e => {
      if (!started || attempts.length >= 6) return
      const key = e.key.toUpperCase()
      if (/^[A-ZА-ЯЁ]$/.test(key) && guess.length < secret.length)
        setGuess(g => g + key)
      if (key === 'BACKSPACE') setGuess(g => g.slice(0, -1))
      if (key === 'ENTER' && guess.length === secret.length) {
        setAttempts(a => [...a, guess])
        setGuess('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [guess, secret, started, attempts])

  const start = () => {
    if (secret && !secret.includes(' ')) setStarted(true)
  }

  const renderRow = word => {
    const colors = Array(secret.length).fill('bg-gray-300')
    const used = Array(secret.length).fill(false)
    for (let i = 0; i < word.length; i++)
      if (word[i] === secret[i]) (colors[i] = 'bg-green-500'), (used[i] = true)
    for (let i = 0; i < word.length; i++)
      if (colors[i] !== 'bg-green-500') {
        const idx = secret
          .split('')
          .findIndex((c, j) => c === word[i] && !used[j])
        if (idx !== -1) (colors[i] = 'bg-yellow-400'), (used[idx] = true)
      }
    return (
      <div className='flex gap-1 sm:gap-2 justify-center'>
        {word.split('').map((char, i) => (
          <div
            key={i}
            className={`font-bold rounded flex items-center justify-center text-white ${colors[i]}`}
            style={{
              width: cellSize,
              height: cellSize,
              fontSize: cellSize > 40 ? 24 : 18,
              borderRadius: 8,
            }}
          >
            {char}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-2 sm:p-6'>
      <h1 className='text-3xl sm:text-5xl font-extrabold mb-6 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in'>
        🔤 Сөзді Тап
      </h1>
      {!started ? (
        <div className='space-y-6 w-full max-w-xs sm:max-w-sm'>
          <input
            type='text'
            maxLength={10}
            className='p-3 w-full text-white rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900'
            placeholder='Құпия сөзді енгізіңіз'
            value={secret}
            onChange={e => setSecret(e.target.value.toUpperCase())}
            style={{ fontSize: cellSize > 40 ? 22 : 16 }}
          />
          <button
            onClick={start}
            className='w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition transform hover:scale-105 text-lg sm:text-xl'
          >
            Бастау
          </button>
        </div>
      ) : (
        <div className='space-y-4 sm:space-y-6 w-full max-w-md'>
          {attempts.map((word, idx) => (
            <div key={idx}>{renderRow(word)}</div>
          ))}
          {attempts.length < 6 && (
            <div className='flex gap-1 sm:gap-2 justify-center'>
              {[...Array(secret.length)].map((_, i) => (
                <div
                  key={i}
                  className='border-2 border-gray-700 font-bold rounded-lg flex items-center justify-center bg-gray-800 text-white'
                  style={{
                    width: cellSize,
                    height: cellSize,
                    fontSize: cellSize > 40 ? 24 : 18,
                    borderRadius: 8,
                  }}
                >
                  {guess[i] || ''}
                </div>
              ))}
            </div>
          )}
          {attempts.includes(secret) && (
            <p className='text-green-400 font-bold text-xl sm:text-2xl animate-pulse'>
              🎉 Жеңіс!
            </p>
          )}
          {attempts.length === 6 && !attempts.includes(secret) && (
            <p className='text-red-400 font-bold text-xl sm:text-2xl'>
              💀 Жеңіліс. Сөз: {secret}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
