import React, { useState, useEffect, useCallback } from 'react'

const board_width = 400
const board_height = 600
const bird_size = 20
const gravity = 1
const flap_strength = -12
const pipe_width = 60
const pipe_gap = 200
const pipe_velocity = 5
const pipe_width_gap = 200

export default function FlappyBird() {
  const [birdY, setBirdY] = useState(board_height / 2)
  const [birdVelocity, setBirdVelocity] = useState(0)
  const [pipes, setPipes] = useState([])
  const [score, setScore] = useState(0)
  const [highscore, setHighscore] = useState(
    () => parseInt(localStorage.getItem('highscore')) || 0
  )
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)

  const handleFlap = () => {
    if (!gameStarted || gameOver) return
    setBirdVelocity(flap_strength)
  }

  const createPipe = useCallback(() => {
    const topY =
      Math.floor(Math.random() * (board_height - pipe_gap - 100)) + 50
    return {
      x: board_width + pipe_width_gap,
      y: topY,
    }
  }, [])

  const restartGame = () => {
    setBirdY(board_height / 2)
    setBirdVelocity(0)
    setPipes([])
    setScore(0)
    setGameOver(false)
    setGameStarted(false)
    setShowCongrats(false)
  }

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Space') handleFlap()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, gameOver])

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const interval = setInterval(() => {
      setBirdY(prev => prev + birdVelocity)
      setBirdVelocity(prev => prev + gravity)

      setPipes(prev =>
        prev
          .map(pipe => {
            const updatedPipe = { ...pipe, x: pipe.x - pipe_velocity }
            if (!pipe.passed && updatedPipe.x + pipe_width < 50) {
              setScore(prevScore => prevScore + 1)
              updatedPipe.passed = true
            }
            return updatedPipe
          })
          .filter(pipe => pipe.x + pipe_width > 0)
      )

      if (
        pipes.length === 0 ||
        pipes[pipes.length - 1].x < board_width - pipe_width_gap
      ) {
        setPipes(prev => [...prev, createPipe()])
      }

      const birdIsColliding = pipes.some(
        pipe =>
          pipe.x < 50 + bird_size &&
          pipe.x + pipe_width > 50 &&
          (birdY < pipe.y || birdY + bird_size > pipe.y + pipe_gap)
      )

      if (birdY + bird_size > board_height || birdY < 0 || birdIsColliding) {
        setGameOver(true)
        if (score > highscore) {
          setHighscore(score)
          localStorage.setItem('highscore', score)
          setShowCongrats(true)
          setTimeout(() => setShowCongrats(false), 3000)
        }
        clearInterval(interval)
      }
    }, 20)

    return () => clearInterval(interval)
  }, [
    birdVelocity,
    birdY,
    pipes,
    gameStarted,
    gameOver,
    score,
    highscore,
    createPipe,
  ])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-4 sm:p-6'>
      <h1 className='text-4xl sm:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in'>
        🐦 Flappy Bird
      </h1>

      {!gameStarted ? (
        <button
          onClick={() => setGameStarted(true)}
          className='px-6 py-3 sm:px-8 sm:py-4 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition transform hover:scale-105'
        >
          ▶️ Ойынды бастау
        </button>
      ) : (
        <>
          <div
            className='relative border-4 border-gray-700 rounded-lg overflow-hidden shadow-lg'
            style={{
              width: '500px',
              maxWidth: '800px',
              height: '75vh',
              maxHeight: '600px',
            }}
            onClick={handleFlap}
          >
            <div
              className='absolute bg-yellow-400 rounded-full shadow-md animate-bounce'
              style={{
                top: birdY,
                left: '12%',
                width: bird_size,
                height: bird_size,
              }}
            />
            {pipes.map((pipe, index) => (
              <React.Fragment key={index}>
                <div
                  className='absolute bg-green-500 rounded-t-lg shadow-md'
                  style={{
                    left: pipe.x,
                    top: 0,
                    width: pipe_width,
                    height: pipe.y,
                  }}
                />
                <div
                  className='absolute bg-green-500 rounded-b-lg shadow-md'
                  style={{
                    left: pipe.x,
                    top: pipe.y + pipe_gap,
                    width: pipe_width,
                    height: board_height - pipe.y - pipe_gap,
                  }}
                />
              </React.Fragment>
            ))}
          </div>

          <p className='mt-6 text-xl sm:text-2xl font-bold drop-shadow-md'>
            🏆 Ұпай: <span className='text-yellow-300'>{score}</span>
          </p>
          <p className='text-md sm:text-lg drop-shadow-md'>
            🎖 Ең жоғары ұпай:{' '}
            <span className='text-green-300'>{highscore}</span>
          </p>
        </>
      )}

      {showCongrats && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <h2 className='text-4xl sm:text-5xl font-bold text-yellow-300 animate-pulse'>
            🎉 Жаңа рекорд! 🎉
          </h2>
        </div>
      )}

      {gameOver && (
        <div className='mt-8 p-4 sm:p-6 bg-gray-800 text-white rounded-lg shadow-xl text-center animate-fade-in'>
          <h2 className='text-2xl sm:text-3xl font-bold text-red-400 mb-4'>
            Ойын аяқталды! 😢
          </h2>
          <button
            onClick={restartGame}
            className='mt-4 px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105'
          >
            🔄 Қайта бастау
          </button>
        </div>
      )}
    </div>
  )
}
