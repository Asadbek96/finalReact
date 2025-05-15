import React, { useState, useEffect, useCallback } from 'react'

const W = 400,
  H = 600,
  BIRD = 20,
  GRAV = 1,
  FLAP = -12,
  PIPE_W = 60,
  GAP = 200,
  SPEED = 5,
  DIST = 200

export default function FlappyBird() {
  const [birdY, setBirdY] = useState(H / 2)
  const [vel, setVel] = useState(0)
  const [pipes, setPipes] = useState([])
  const [score, setScore] = useState(0)
  const [high, setHigh] = useState(
    () => +localStorage.getItem('highscore') || 0
  )
  const [over, setOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)

  const flap = () => {
    if (started && !over) setVel(FLAP)
  }
  const createPipe = useCallback(
    () => ({
      x: W + DIST,
      y: Math.floor(Math.random() * (H - GAP - 100)) + 50,
    }),
    []
  )

  const restart = () => {
    setBirdY(H / 2)
    setVel(0)
    setPipes([])
    setScore(0)
    setOver(false)
    setStarted(false)
    setShowCongrats(false)
  }

  useEffect(() => {
    const onKey = e => e.code === 'Space' && flap()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [started, over])

  useEffect(() => {
    if (!started || over) return
    const interval = setInterval(() => {
      setBirdY(y => y + vel)
      setVel(v => v + GRAV)
      setPipes(ps =>
        ps
          .map(pipe => {
            const p = { ...pipe, x: pipe.x - SPEED }
            if (!pipe.passed && p.x + PIPE_W < 50) {
              setScore(s => s + 1)
              p.passed = true
            }
            return p
          })
          .filter(pipe => pipe.x + PIPE_W > 0)
      )
    }, 20)
    return () => clearInterval(interval)
  }, [vel, started, over])

  useEffect(() => {
    if (!started || over) return
    if (!pipes.length || pipes[pipes.length - 1].x < W - DIST)
      setPipes(ps => [...ps, createPipe()])
    const birdCollide = pipes.some(
      p =>
        p.x < 50 + BIRD &&
        p.x + PIPE_W > 50 &&
        (birdY < p.y || birdY + BIRD > p.y + GAP)
    )
    if (birdY + BIRD > H || birdY < 0 || birdCollide) {
      setOver(true)
      if (score > high) {
        setHigh(score)
        localStorage.setItem('highscore', score)
        setShowCongrats(true)
        setTimeout(() => setShowCongrats(false), 3000)
      }
    }
  }, [birdY, pipes, started, over, score, high, createPipe])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-4 sm:p-6'>
      <h1 className='text-4xl sm:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in'>
        🐦 Flappy Bird
      </h1>
      {!started ? (
        <button
          onClick={() => setStarted(true)}
          className='px-6 py-3 sm:px-8 sm:py-4 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition transform hover:scale-105'
        >
          ▶️ Ойынды бастау
        </button>
      ) : (
        <>
          <div
            className='relative border-4 border-gray-700 rounded-lg overflow-hidden shadow-lg'
            style={{
              width: 500,
              maxWidth: 800,
              height: '75vh',
              maxHeight: 600,
            }}
            onClick={flap}
          >
            <div
              className='absolute bg-yellow-400 rounded-full shadow-md animate-bounce'
              style={{ top: birdY, left: '12%', width: BIRD, height: BIRD }}
            />
            {pipes.map((p, i) => (
              <React.Fragment key={i}>
                <div
                  className='absolute bg-green-500 rounded-t-lg shadow-md'
                  style={{ left: p.x, top: 0, width: PIPE_W, height: p.y }}
                />
                <div
                  className='absolute bg-green-500 rounded-b-lg shadow-md'
                  style={{
                    left: p.x,
                    top: p.y + GAP,
                    width: PIPE_W,
                    height: H - p.y - GAP,
                  }}
                />
              </React.Fragment>
            ))}
            {showCongrats && (
              <div className='absolute inset-0 flex items-center justify-center z-50 pointer-events-none'>
                <div className='bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-opacity-80 rounded-xl shadow-2xl border-4 border-yellow-400 px-8 py-6 flex items-center justify-center animate-fade-in-up'>
                  <h2 className='text-4xl sm:text-5xl font-bold text-yellow-700 drop-shadow-lg animate-pulse'>
                    🎉 Жаңа рекорд! 🎉
                  </h2>
                </div>
              </div>
            )}
          </div>
          <p className='mt-6 text-xl sm:text-2xl font-bold drop-shadow-md'>
            🏆 Ұпай: <span className='text-yellow-300'>{score}</span>
          </p>
          <p className='text-md sm:text-lg drop-shadow-md'>
            🎖 Ең жоғары ұпай: <span className='text-green-300'>{high}</span>
          </p>
        </>
      )}
      {over && (
        <div className='mt-8 p-4 sm:p-6 bg-gray-800 text-white rounded-lg shadow-xl text-center animate-fade-in'>
          <h2 className='text-2xl sm:text-3xl font-bold text-red-400 mb-4'>
            Ойын аяқталды! 😢
          </h2>
          <button
            onClick={restart}
            className='mt-4 px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105'
          >
            🔄 Қайта бастау
          </button>
        </div>
      )}
    </div>
  )
}
