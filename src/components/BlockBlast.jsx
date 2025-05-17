import React, { useState, useEffect } from 'react'

function getBoardParams() {
  const w = window.innerWidth
  if (w < 480) {
    return {
      SIZE: 10,
      CELL: Math.max(14, Math.floor(w / 20)),
      GAP: 2,
      MAX_WIDTH: 200,
    }
  } else if (w < 768) {
    return {
      SIZE: 10,
      CELL: Math.max(22, Math.floor(w / 18)),
      GAP: 2,
      MAX_WIDTH: 340,
    }
  } else {
    return {
      SIZE: 10,
      CELL: 36,
      GAP: 3,
      MAX_WIDTH: 420,
    }
  }
}

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

const rotate = m => m[0].map((_, i) => m.map(r => r[i]).reverse())

function randomPieces() {
  return Array(3)
    .fill(0)
    .map(() => SHAPES[Math.floor(Math.random() * SHAPES.length)])
}

export default function BlockBlast() {
  const [boardParams, setBoardParams] = useState(getBoardParams())
  const { SIZE, CELL, GAP, MAX_WIDTH } = boardParams

  useEffect(() => {
    const onResize = () => setBoardParams(getBoardParams())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const EMPTY = Array(SIZE).fill(null)
  const EMPTY_BOARD = Array(SIZE)
    .fill(null)
    .map(() => [...EMPTY])

  const [board, setBoard] = useState(EMPTY_BOARD)
  const [pieces, setPieces] = useState(randomPieces())
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [over, setOver] = useState(false)
  const [history, setHistory] = useState(() =>
    JSON.parse(localStorage.getItem('blockBlastScores') || '[]')
  )

  useEffect(() => {
    localStorage.setItem('blockBlastScores', JSON.stringify(history))
  }, [history])

  function canPlace(x, y, shape, b = board) {
    for (let i = 0; i < shape.length; i++)
      for (let j = 0; j < shape[0].length; j++)
        if (shape[i][j]) {
          const ny = y + i,
            nx = x + j
          if (ny < 0 || nx < 0 || ny >= SIZE || nx >= SIZE || b[ny][nx])
            return false
        }
    return true
  }

  function place(x, y, shape) {
    if (!canPlace(x, y, shape)) return
    const b = board.map(r => [...r])
    shape.forEach((row, i) =>
      row.forEach((cell, j) => {
        if (cell) b[y + i][x + j] = 'X'
      })
    )
    let lines = 0
    for (let i = 0; i < SIZE; i++)
      if (b[i].every(c => c)) (b[i] = [...EMPTY]), lines++
    setScore(s => s + lines)
    setBoard(b)
    setPieces(randomPieces())
    setSelected(null)
    checkOver(b)
  }

  function checkOver(b) {
    const can = pieces.some(shape =>
      b.some((row, y) => row.some((_, x) => canPlace(x, y, shape, b)))
    )
    if (!can) {
      setOver(true)
      setHistory(h => [...h, score])
    }
  }

  function handleDrop(e, x, y) {
    e.preventDefault()
    const idx = e.dataTransfer.getData('shapeIndex')
    place(x, y, pieces[idx])
  }

  function handleDragStart(e, idx) {
    e.dataTransfer.setData('shapeIndex', idx)
  }

  function restart() {
    setBoard(EMPTY_BOARD)
    setPieces(randomPieces())
    setScore(0)
    setOver(false)
    setSelected(null)
  }

  function rotateSelected() {
    if (selected === null) return
    setPieces(ps => ps.map((p, i) => (i === selected ? rotate(p) : p)))
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-2 sm:p-6'>
      <h1 className='text-3xl sm:text-5xl font-extrabold mb-4 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in'>
        🧱 Block Blast
      </h1>
      <div
        className='grid mx-auto border-4 border-gray-700 rounded-lg bg-gradient-to-r from-blue-400 to-teal-500 shadow-lg'
        style={{
          gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
          gap: GAP,
          width: `${CELL * SIZE + GAP * (SIZE - 1)}px`,
          maxWidth: MAX_WIDTH,
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, x, y)}
              className={`rounded-md flex items-center justify-center border ${
                cell ? 'bg-yellow-500' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              style={{
                width: `${CELL}px`,
                height: `${CELL}px`,
                minWidth: `${CELL}px`,
                minHeight: `${CELL}px`,
                transition: 'all 0.2s',
              }}
            ></div>
          ))
        )}
      </div>
      <h2 className='mt-4 sm:mt-6 text-lg sm:text-xl font-semibold text-white'>
        Фигуралар
      </h2>
      <div className='flex justify-center gap-2 sm:gap-6 mt-3 sm:mt-4 flex-wrap'>
        {pieces.map((shape, i) => (
          <div
            key={i}
            draggable
            onClick={() => setSelected(i)}
            onDragStart={e => handleDragStart(e, i)}
            className={`cursor-grab p-1 sm:p-3 border-2 rounded-lg shadow-xl transition-all hover:scale-110 ${
              selected === i
                ? 'border-red-500 bg-red-100'
                : 'border-white bg-gradient-to-br from-green-400 to-green-600'
            }`}
            style={{
              display: 'inline-block',
            }}
          >
            {shape.map((row, y) => (
              <div key={y} className='flex'>
                {row.map((cell, x) => (
                  <div
                    key={x}
                    className={`rounded-sm border ${
                      cell ? 'bg-green-700' : 'bg-transparent'
                    }`}
                    style={{
                      width: `${CELL * 0.6}px`,
                      height: `${CELL * 0.6}px`,
                      margin: `${GAP / 2}px`,
                    }}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={rotateSelected}
        className='mt-4 px-4 sm:px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition'
      >
        🔄 Таңдалған фигураны бұру
      </button>
      <div className='mt-6 sm:mt-8'>
        <p className='text-lg sm:text-xl font-semibold text-white'>
          Ұпай: {score}
        </p>
        <p className='text-white mt-2'>Тарих: {history.join(', ')}</p>
      </div>
      {over && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-xl text-center animate-fade-in'>
            <h2 className='text-2xl sm:text-3xl font-bold text-red-400 mb-4'>
              Ойын аяқталды! 😢
            </h2>
            <button
              onClick={restart}
              className='mt-4 px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105'
            >
              🔄 Қайта бастау
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
