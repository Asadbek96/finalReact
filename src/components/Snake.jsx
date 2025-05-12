import React, { useEffect, useState } from 'react'

const board_size = 20
const initial_snake = [{ x: 9, y: 9 }]
const initial_direction = { x: 1, y: 0 }

export default function SnakeGame() {
  const [snake, setSnake] = useState(initial_snake)
  const [food, setFood] = useState(generateFood())
  const [direction, setDirection] = useState(initial_direction)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [scoreHistory, setScoreHistory] = useState([])

  function generateFood() {
    return {
      x: Math.floor(Math.random() * board_size),
      y: Math.floor(Math.random() * board_size),
    }
  }

  useEffect(() => {
    const handleKey = e => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 })
          break
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 })
          break
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 })
          break
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 })
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [direction])

  useEffect(() => {
    if (gameOver) return

    const interval = setInterval(() => {
      moveSnake()
    }, 150)

    return () => clearInterval(interval)
  }, [snake, direction, gameOver])

  function moveSnake() {
    const newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    }

    if (
      newHead.x < 0 ||
      newHead.y < 0 ||
      newHead.x >= board_size ||
      newHead.y >= board_size ||
      snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
      setGameOver(true)
      setScoreHistory(prevHistory => [...prevHistory, score])
      return
    }

    const newSnake = [newHead, ...snake]

    if (newHead.x === food.x && newHead.y === food.y) {
      setFood(generateFood())
      setScore(prevScore => prevScore + 1)
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)
  }

  function resetGame() {
    setSnake(initial_snake)
    setFood(generateFood())
    setDirection(initial_direction)
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-6'>
      <h1 className='text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-500 animate-fade-in'>
        🐍 Жылан
      </h1>

      <p className='text-2xl font-bold mb-4'>
        🏆 Ұпай: <span className='text-green-300'>{score}</span>
      </p>

      <div
        className='relative grid grid-cols-20 gap-1 bg-gray-800 rounded-lg shadow-lg p-1'
        style={{
          width: board_size * 24,
          height: board_size * 24,
        }}
      >
        {Array.from({ length: board_size * board_size }).map((_, idx) => {
          const x = idx % board_size
          const y = Math.floor(idx / board_size)
          const isSnake = snake.some(
            segment => segment.x === x && segment.y === y
          )
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
      </div>

      {gameOver && (
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
          {scoreHistory.map((score, index) => (
            <li key={index} className='text-lg'>
              Ойын {index + 1}: {score} ұпай
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
