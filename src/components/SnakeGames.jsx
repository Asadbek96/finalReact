import React, { useEffect, useState } from 'react'

function getBoardParams() {
  const w = window.innerWidth
  if (w < 480) {
    return {
      BOARD_SIZE: 12,
      CELL: Math.max(16, Math.floor(w / 16)),
      GAP: 1,
    }
  } else if (w < 768) {
    return {
      BOARD_SIZE: 16,
      CELL: Math.max(20, Math.floor(w / 22)),
      GAP: 1,
    }
  } else {
    return {
      BOARD_SIZE: 20,
      CELL: 24,
      GAP: 1,
    }
  }
}

const INITIAL_DIRECTION = { x: 1, y: 0 }

function generateFood(BOARD_SIZE) {
  return {
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE),
  }
}

export default function SnakeGame() {
  const [boardParams, setBoardParams] = useState(getBoardParams())
  const { BOARD_SIZE, CELL, GAP } = boardParams

  useEffect(() => {
    const onResize = () => setBoardParams(getBoardParams())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const INITIAL_SNAKE = [
    { x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) },
  ]
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState(generateFood(BOARD_SIZE))
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
      setFood(generateFood(BOARD_SIZE))
      setScore(s => s + 1)
    } else {
      newSnake.pop()
    }
    setSnake(newSnake)
  }

  function startGame() {
    setSnake([{ x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) }])
    setFood(generateFood(BOARD_SIZE))
    setDirection(INITIAL_DIRECTION)
    setGameOver(false)
    setScore(0)
    setShowCongrats(false)
    setStarted(true)
  }

  function resetGame() {
    startGame()
  }

  const boardPx = BOARD_SIZE * CELL + (BOARD_SIZE - 1) * GAP

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-2 sm:p-6'>
      <h1 className='text-3xl sm:text-5xl font-extrabold mb-4 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-500 animate-fade-in'>
        🐍 Жылан
      </h1>

      {!started && (
        <button
          onClick={startGame}
          className='mb-8 px-6 py-3 sm:px-8 sm:py-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all transform hover:scale-105 text-xl sm:text-2xl font-bold'
        >
          ▶️ Бастау
        </button>
      )}

      {started && (
        <>
          <p className='text-lg sm:text-2xl font-bold mb-2 sm:mb-4'>
            🏆 Ұпай: <span className='text-green-300'>{score}</span>
          </p>
          <p className='text-base sm:text-lg font-semibold mb-2'>
            🎖 Ең жоғары ұпай:{' '}
            <span className='text-yellow-300'>{highscore}</span>
          </p>

          <div
            className='relative grid bg-gray-800 rounded-lg shadow-lg p-1'
            style={{
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
              gap: GAP,
              width: boardPx,
              height: boardPx,
              maxWidth: '98vw',
              maxHeight: '98vw',
              minWidth: 120,
              minHeight: 120,
              boxSizing: 'content-box',
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
                  className={`rounded-sm transition-all duration-100 ${
                    isSnake
                      ? isHead
                        ? 'bg-green-700 shadow-lg'
                        : 'bg-green-400'
                      : isFood
                      ? 'bg-pink-500 animate-bounce shadow-md'
                      : 'bg-gray-700'
                  }`}
                  style={{
                    width: CELL,
                    height: CELL,
                    minWidth: CELL,
                    minHeight: CELL,
                  }}
                ></div>
              )
            })}

            {showCongrats && (
              <div className='absolute inset-0 flex items-center justify-center z-50 pointer-events-none'>
                <div className='bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-opacity-80 rounded-xl shadow-2xl border-4 border-yellow-400 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-center animate-fade-in-up'>
                  <h2 className='text-2xl sm:text-4xl font-bold text-yellow-700 drop-shadow-lg animate-pulse'>
                    🎉 Жаңа рекорд! 🎉
                  </h2>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {gameOver && started && (
        <div className='mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-800 text-white rounded-lg shadow-xl text-center animate-fade-in'>
          <h2 className='text-2xl sm:text-3xl font-bold text-red-400 mb-4'>
            Сіз ұтылдыңыз! 😢
          </h2>
          <button
            onClick={resetGame}
            className='mt-4 px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105'
          >
            🔄 Қайта бастау
          </button>
        </div>
      )}

      <div className='mt-6 sm:mt-8 w-full max-w-xs sm:max-w-md'>
        <h3 className='text-lg sm:text-xl font-bold mb-2 sm:mb-4'>
          Ұпай тарихы:
        </h3>
        <ul className='list-disc list-inside'>
          {scoreHistory.map((score, idx) => (
            <li key={idx} className='text-base sm:text-lg'>
              Ойын {idx + 1}: {score} ұпай
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
