import React, { useEffect, useState } from 'react'

const BOARD_SIZE = 20
const INITIAL_SNAKE = [{ x: 9, y: 9 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }

function generateFood() {
  return {
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE),
  }
}

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState(generateFood())
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [scoreHistory, setScoreHistory] = useState([])
  const [highscore, setHighscore] = useState(
    () => Number(localStorage.getItem('snake_highscore')) || 0
  )
  const [showCongrats, setShowCongrats] = useState(false)
  const [started, setStarted] = useState(false)


  useEffect(() => {
    const handleKey = e => {
      if (!started || gameOver) return
      if (e.key === 'ArrowUp' && direction.y === 0)
        setDirection({ x: 0, y: -1 })
      if (e.key === 'ArrowDown' && direction.y === 0)
        setDirection({ x: 0, y: 1 })
      if (e.key === 'ArrowLeft' && direction.x === 0)
        setDirection({ x: -1, y: 0 })
      if (e.key === 'ArrowRight' && direction.x === 0)
        setDirection({ x: 1, y: 0 })
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [direction, started, gameOver])


  useEffect(() => {
    if (!started || gameOver) return
    const interval = setInterval(moveSnake, 150)
    return () => clearInterval(interval)
  }, [snake, direction, gameOver, started])

  function moveSnake() {
    const newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    }

    // Проверка на проигрыш
    if (
      newHead.x < 0 ||
      newHead.y < 0 ||
      newHead.x >= BOARD_SIZE ||
      newHead.y >= BOARD_SIZE ||
      snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
      setGameOver(true)
      setScoreHistory(h => [...h, score])
      if (score > highscore) {
        setHighscore(score)
        localStorage.setItem('snake_highscore', score)
        setShowCongrats(true)
        setTimeout(() => setShowCongrats(false), 3000)
      }
      return
    }

    const newSnake = [newHead, ...snake]
    if (newHead.x === food.x && newHead.y === food.y) {
      setFood(generateFood())
      setScore(s => s + 1)
    } else {
      newSnake.pop()
    }
    setSnake(newSnake)
  }

  function startGame() {
    setSnake(INITIAL_SNAKE)
    setFood(generateFood())
    setDirection(INITIAL_DIRECTION)
    setGameOver(false)
    setScore(0)
    setShowCongrats(false)
    setStarted(true)
  }

  function resetGame() {
    startGame()
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-6'>
      <h1 className='text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-500 animate-fade-in'>
        🐍 Жылан
      </h1>

      {!started && (
        <button
          onClick={startGame}
          className='mb-8 px-8 py-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all transform hover:scale-105 text-2xl font-bold'
        >
          ▶️ Бастау
        </button>
      )}

      {started && (
        <>
          <p className='text-2xl font-bold mb-4'>
            🏆 Ұпай: <span className='text-green-300'>{score}</span>
          </p>
          <p className='text-lg font-semibold mb-2'>
            🎖 Ең жоғары ұпай:{' '}
            <span className='text-yellow-300'>{highscore}</span>
          </p>

          <div
            className='relative grid grid-cols-20 gap-1 bg-gray-800 rounded-lg shadow-lg p-1'
            style={{
              width: BOARD_SIZE * 24,
              height: BOARD_SIZE * 24,
            }}
          >
            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, idx) => {
              const x = idx % BOARD_SIZE
              const y = Math.floor(idx / BOARD_SIZE)
              const isSnake = snake.some(s => s.x === x && s.y === y)
              const isHead = snake[0].x === x && snake[0].y === y
              const isFood = food.x === x && food.y === y
              return (
                <div
                  key={idx}
                  className={`w-7 h-7 rounded-sm ${
                    isSnake
                      ? isHead
                        ? 'bg-green-700 shadow-lg'
                        : 'bg-green-400'
                      : isFood
                      ? 'bg-pink-500 animate-bounce shadow-md'
                      : 'bg-gray-700'
                  }`}
                ></div>
              )
            })}

            {showCongrats && (
              <div className='absolute inset-0 flex items-center justify-center z-50 pointer-events-none'>
                <div className='bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-opacity-80 rounded-xl shadow-2xl border-4 border-yellow-400 px-8 py-6 flex items-center justify-center animate-fade-in-up'>
                  <h2 className='text-3xl sm:text-4xl font-bold text-yellow-700 drop-shadow-lg animate-pulse'>
                    🎉 Жаңа рекорд! 🎉
                  </h2>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {gameOver && started && (
        <div className='mt-8 p-6 bg-gray-800 text-white rounded-lg shadow-xl text-center animate-fade-in'>
          <h2 className='text-3xl font-bold text-red-400 mb-4'>
            Сіз ұтылдыңыз! 😢
          </h2>
          <button
            onClick={resetGame}
            className='mt-4 px-8 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105'
          >
            🔄 Қайта бастау
          </button>
        </div>
      )}

      <div className='mt-8'>
        <h3 className='text-xl font-bold mb-4'>Ұпай тарихы:</h3>
        <ul className='list-disc list-inside'>
          {scoreHistory.map((score, idx) => (
            <li key={idx} className='text-lg'>
              Ойын {idx + 1}: {score} ұпай
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
