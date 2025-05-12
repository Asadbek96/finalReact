import React, { useState, useEffect } from 'react'

const board_size = 9
const empty_row = Array(board_size).fill(null)
const empty_board = Array(board_size)
  .fill(null)
  .map(() => [...empty_row])  

const SHAPES = [
  [[1, 1, 1]],
  [[1], [1], [1]],
  [
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [[1, 1, 1, 1]],
  [[1], [1], [1], [1]],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [1, 1],
    [1, 0],
    [1, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [0, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [[1]],
  [[1, 1]],
  [[1], [1]],
  [
    [1, 1],
    [1, 0],
  ],
  [
    [1, 1],
    [0, 1],
  ],
]

function rotateMatrix(matrix) {
  const rows = matrix.length
  const cols = matrix[0].length
  const rotated = Array(cols)
    .fill(null)
    .map(() => Array(rows).fill(0))
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotated[j][rows - 1 - i] = matrix[i][j]
    }
  }
  return rotated
}

export default function BlockBlast() {
  const [board, setBoard] = useState(empty_board)
  const [currentPieces, setCurrentPieces] = useState(generateNewPieces())
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [score, setScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [scoreHistory, setScoreHistory] = useState(() => {
    const stored = localStorage.getItem('blockBlastScores')
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem('blockBlastScores', JSON.stringify(scoreHistory))
  }, [scoreHistory])

  function generateNewPieces() {
    return Array(3)
      .fill(0)
      .map(() => SHAPES[Math.floor(Math.random() * SHAPES.length)])
  }

  function canPlaceShape(x, y, shape) {
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[0].length; j++) {
        if (shape[i][j]) {
          const newY = y + i
          const newX = x + j
          if (
            newY >= board_size ||
            newX >= board_size ||
            newX < 0 ||
            newY < 0 ||
            board[newY][newX] !== null
          ) {
            return false
          }
        }
      }
    }
    return true
  }

  function placeShape(x, y, shape) {
    if (!canPlaceShape(x, y, shape)) return

    const updatedBoard = board.map(row => [...row])
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[0].length; j++) {
        if (shape[i][j]) {
          updatedBoard[y + i][x + j] = 'X'
        }
      }
    }

    const clearedLines = removeFullLines(updatedBoard)
    setScore(score + clearedLines)
    setBoard(updatedBoard)
    setCurrentPieces(generateNewPieces())
    setSelectedIndex(null)
    checkGameOver(updatedBoard)
  }

  function removeFullLines(updatedBoard) {
    let linesCleared = 0

    for (let i = 0; i < board_size; i++) {
      if (updatedBoard[i].every(cell => cell !== null)) {
        updatedBoard[i] = [...empty_row]
        linesCleared++
      }
    }

    return linesCleared
  }

  function checkGameOver(updatedBoard) {
    const canPlaceAny = currentPieces.some(shape => {
      for (let y = 0; y < board_size; y++) {
        for (let x = 0; x < board_size; x++) {
          if (canPlaceShape(x, y, shape)) return true
        }
      }
      return false
    })
    if (!canPlaceAny) {
      setIsGameOver(true)
      setScoreHistory(prev => [...prev, score])
    }
  }

  function handleDrop(event, x, y) {
    event.preventDefault()
    const shapeIndex = event.dataTransfer.getData('shapeIndex')
    const shape = currentPieces[shapeIndex]
    if (!shape) return

    placeShape(x, y, shape)
  }

  function handleDragStart(event, index) {
    event.dataTransfer.setData('shapeIndex', index)
  }

  function restartGame() {
    setBoard(empty_board)
    setCurrentPieces(generateNewPieces())
    setScore(0)
    setIsGameOver(false)
    setSelectedIndex(null)
  }

  function rotateSelectedShape() {
    if (selectedIndex === null) return
    const rotated = rotateMatrix(currentPieces[selectedIndex])
    const newShapes = [...currentPieces]
    newShapes[selectedIndex] = rotated
    setCurrentPieces(newShapes)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-6'>
      <h1 className='text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in'>
        🧱 Block Blast
      </h1>

      <div className='grid grid-cols-9 gap-1 w-max mx-auto border-4 border-gray-700 rounded-lg bg-gradient-to-r from-blue-400 to-teal-500 shadow-lg'>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, x, y)}
              className={`w-12 h-12 rounded-md transition-all duration-200 flex items-center justify-center border ${
                cell ? 'bg-yellow-500' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            ></div>
          ))
        )}
      </div>

      <h2 className='mt-6 text-xl font-semibold text-white'>Фигуралар</h2>
      <div className='flex justify-center gap-6 mt-4'>
        {currentPieces.map((shape, index) => (
          <div
            key={index}
            draggable
            onClick={() => setSelectedIndex(index)}
            onDragStart={e => handleDragStart(e, index)}
            className={`cursor-grab active:cursor-grabbing p-3 border-2 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-110 ${
              selectedIndex === index
                ? 'border-red-500 bg-red-100'
                : 'border-white bg-gradient-to-br from-green-400 to-green-600'
            }`}
          >
            {shape.map((row, y) => (
              <div key={y} className='flex'>
                {row.map((cell, x) => (
                  <div
                    key={x}
                    className={`w-4 h-4 m-0.5 rounded-sm border ${
                      cell ? 'bg-green-700' : 'bg-transparent'
                    }`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={rotateSelectedShape}
        className='mt-4 px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition'
      >
        🔄 Таңдалған фигураны бұру
      </button>

      <div className='mt-8'>
        <p className='text-xl font-semibold text-white'>Ұпай: {score}</p>
        <p className='text-white mt-2'>Тарих: {scoreHistory.join(', ')}</p>
      </div>

      {isGameOver && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-xl text-center animate-fade-in'>
            <h2 className='text-3xl font-bold text-red-400 mb-4'>
              Ойын аяқталды! 😢
            </h2>
            <button
              onClick={restartGame}
              className='mt-4 px-8 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105'
            >
              🔄 Қайта бастау
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
