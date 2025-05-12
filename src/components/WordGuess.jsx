import React, { useState } from 'react'

export default function WordGuessGame() {
  const [secretWord, setSecretWord] = useState('')
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState([])
  const [gameStarted, setGameStarted] = useState(false)

  function startGame() {
    if (secretWord.length === 0 || secretWord.includes(' ')) return
    setGameStarted(true)
  }

  function handleKeyPress(e) {
    if (!gameStarted || attempts.length >= 6) return
    const key = e.key.toUpperCase()
    if (/^[A-ZА-ЯЁ]$/.test(key) && guess.length < secretWord.length) {
      setGuess(prev => prev + key)
    } else if (key === 'BACKSPACE') {
      setGuess(prev => prev.slice(0, -1))
    } else if (key === 'ENTER' && guess.length === secretWord.length) {
      setAttempts(prev => [...prev, guess])
      setGuess('')
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  })

  function renderGuessRow(word) {
    const colors = Array(secretWord.length).fill('bg-gray-300')
    const used = Array(secretWord.length).fill(false)

    for (let i = 0; i < word.length; i++) {
      if (word[i] === secretWord[i]) {
        colors[i] = 'bg-green-500'
        used[i] = true
      }
    }

    for (let i = 0; i < word.length; i++) {
      if (colors[i] !== 'bg-green-500') {
        const idx = secretWord
          .split('')
          .findIndex((c, j) => c === word[i] && !used[j])
        if (idx !== -1) {
          colors[i] = 'bg-yellow-400'
          used[idx] = true
        }
      }
    }

    return (
      <div className='flex gap-2 justify-center'>
        {word.split('').map((char, i) => (
          <div
            key={i}
            className={`w-12 h-12 text-xl font-bold rounded flex items-center justify-center text-white ${colors[i]}`}
          >
            {char}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-6'>
      <h1 className='text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in'>
        🔤 Сөзді Тап
      </h1>

      {!gameStarted ? (
        <div className='space-y-6'>
          <input
            type='text'
            maxLength={6}
            className='p-3 text-black rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Құпия сөзді енгізіңіз'
            value={secretWord}
            onChange={e => setSecretWord(e.target.value.toUpperCase())}
          />
          <button
            onClick={startGame}
            className='px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition transform hover:scale-105'
          >
            Бастау
          </button>
        </div>
      ) : (
        <div className='space-y-6'>
          {attempts.map((word, idx) => (
            <div key={idx}>{renderGuessRow(word)}</div>
          ))}
          {attempts.length < 6 && (
            <div className='flex gap-2 justify-center'>
              {[...Array(secretWord.length)].map((_, i) => (
                <div
                  key={i}
                  className='w-12 h-12 border-2 border-gray-700 text-xl font-bold rounded-lg flex items-center justify-center bg-gray-800'
                >
                  {guess[i] || ''}
                </div>
              ))}
            </div>
          )}
          {attempts.includes(secretWord) && (
            <p className='text-green-400 font-bold text-2xl animate-pulse'>
              🎉 Жеңіс!
            </p>
          )}
          {attempts.length === 6 && !attempts.includes(secretWord) && (
            <p className='text-red-400 font-bold text-2xl'>
              💀 Жеңіліс. Сөз: {secretWord}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
