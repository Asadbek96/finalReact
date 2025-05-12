import React, { useState, useEffect } from 'react'

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],  
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export default function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [mode, setMode] = useState('pvp')
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: null })

  useEffect(() => {
    const win = calculateWinner(squares)
    if (win) setWinnerInfo(win)
    else setWinnerInfo({ winner: null, line: null })

    if (mode === 'bot' && !xIsNext && !win?.winner) {
      const timer = setTimeout(makeSmartBotMove, 400)
      return () => clearTimeout(timer)
    }
  }, [squares, xIsNext, mode])

  const handleClick = i => {
    if (squares[i] || winnerInfo.winner || (mode === 'bot' && !xIsNext)) return
    const next = [...squares]
    next[i] = xIsNext ? 'X' : 'O'
    setSquares(next)
    setXIsNext(!xIsNext)
  }

  const handleRestart = () => {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setWinnerInfo({ winner: null, line: null })
  }

  const makeSmartBotMove = () => {
    const move = getBestMove(squares, 'O', 'X')
    if (move === null) return
    const next = [...squares]
    next[move] = 'O'
    setSquares(next)
    setXIsNext(true)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-4 sm:p-6'>
      <h1 className='text-3xl sm:text-5xl font-extrabold mb-6 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in'>
        ✖️ Крестиктер-нөлдер ⭕
      </h1>

      <div className='mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center'>
        <label className='font-semibold text-base sm:text-lg'>Режим:</label>
        <select
          value={mode}
          onChange={e => {
            setMode(e.target.value)
            handleRestart()
          }}
          className='p-2 rounded-lg bg-gray-800 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base'
        >
          <option value='pvp'>1-ге 1</option>
          <option value='bot'>Ботқа қарсы</option>
        </select>
      </div>

      <div className='grid grid-cols-3 gap-2 sm:gap-3 w-[220px] sm:w-[260px] md:w-[300px]'>
        {squares.map((val, i) => {
          const isWinning = winnerInfo.line?.includes(i)
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-2xl sm:text-3xl md:text-4xl font-bold rounded-lg flex items-center justify-center border-2 transition-all duration-300 ease-in-out transform
                ${val ? 'cursor-default' : 'hover:scale-105 hover:bg-gray-700'}
                ${
                  isWinning
                    ? 'bg-green-500 text-white scale-110 shadow-xl'
                    : 'bg-gray-800 text-gray-300'
                }
              `}
            >
              {val}
            </button>
          )
        })}
      </div>

      <div className='mt-6 sm:mt-8 text-base sm:text-lg text-center'>
        {winnerInfo.winner ? (
          <h2 className='text-2xl sm:text-3xl font-bold text-green-400 animate-pulse'>
            Жеңімпаз: {winnerInfo.winner}
          </h2>
        ) : squares.every(Boolean) ? (
          <p className='text-gray-400'>Тең ойын. Бұл керемет болды.</p>
        ) : (
          <p className='text-blue-400'>Кезек: {xIsNext ? '✖️' : '⭕'}</p>
        )}

        <button
          onClick={handleRestart}
          className='mt-4 sm:mt-6 px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 text-sm sm:text-base'
        >
          🔄 Қайта бастау
        </button>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  for (let line of winningCombos) {
    const [a, b, c] = line
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { winner: squares[a], line }
    }
  }
  return null
}

function getBestMove(board, bot, player) {
  const winMove = findWinningMove(board, bot)
  if (winMove !== null) return winMove

  const blockMove = findWinningMove(board, player)
  if (blockMove !== null) return blockMove

  const priority = [4, 0, 2, 6, 8, 1, 3, 5, 7]
  return priority.find(i => !board[i]) ?? null
}

function findWinningMove(board, symbol) {
  for (let [a, b, c] of winningCombos) {
    const line = [board[a], board[b], board[c]]
    const count = line.filter(s => s === symbol).length
    const emptyIndex = [a, b, c].find(i => !board[i])
    if (count === 2 && emptyIndex !== undefined) return emptyIndex
  }
  return null
}
