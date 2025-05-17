import React, { useState, useEffect, useCallback } from 'react'

function getGameParams() {
  const w = window.innerWidth
  if (w < 480) {
    return {
      W: 170,
      H: 220,
      BIRD: 10,
      GRAV: 0.6,
      FLAP: -6,
      PIPE_W: 18,
      GAP: 50,
      SPEED: 1.5,
      DIST: 55,
    }
  } else if (w < 768) {
    return {
      W: 180,
      H: 260,
      BIRD: 10,
      GRAV: 0.7,
      FLAP: -7,
      PIPE_W: 20,
      GAP: 60,
      SPEED: 1.7,
      DIST: 70,
    }
  } else {
    return {
      W: 400,
      H: 600,
      BIRD: 20,
      GRAV: 1,
      FLAP: -12,
      PIPE_W: 60,
      GAP: 200,
      SPEED: 5,
      DIST: 200,
    }
  }
}

export default function FlappyBird({ user, setUser }) {
  const [params, setParams] = useState(getGameParams())
  const { W, H, BIRD, GRAV, FLAP, PIPE_W, GAP, SPEED, DIST } = params
  const BIRD_X = Math.round(W * 0.12)

  useEffect(() => {
    const onResize = () => setParams(getGameParams())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const [birdY, setBirdY] = useState(H / 2)
  const [vel, setVel] = useState(0)
  const [pipes, setPipes] = useState([])
  const [score, setScore] = useState(0)
  const [high, setHigh] = useState(() => {
    if (user?.stats) {
      const stat = user.stats.find(s => s.name === 'Flappy Bird')
      return stat ? stat.bestScore : 0
    }
    return +localStorage.getItem('highscore') || 0
  })
  const [over, setOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)

  useEffect(() => {
    setBirdY(params.H / 2)
    setPipes([])
    setVel(0)
    setOver(false)
    setStarted(false)
    setShowCongrats(false)
    setScore(0)
  }, [params])

  const flap = () => {
    if (started && !over) setVel(FLAP)
  }
  const createPipe = useCallback(
    () => ({
      x: W + DIST,
      y: Math.floor(Math.random() * (H - GAP - 40)) + 20,
      passed: false,
    }),
    [W, H, GAP, DIST]
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
  }, [started, over, FLAP])

  useEffect(() => {
    if (!started || over) return
    const interval = setInterval(() => {
      setBirdY(y => y + vel)
      setVel(v => v + GRAV)
      setPipes(ps =>
        ps
          .map(pipe => {
            const p = { ...pipe, x: pipe.x - SPEED }
            if (!p.passed && p.x + PIPE_W < BIRD_X) {
              setScore(s => s + 1)
              p.passed = true
            }
            return p
          })
          .filter(pipe => pipe.x + PIPE_W > 0)
      )
    }, 20)
    return () => clearInterval(interval)
  }, [vel, started, over, GRAV, SPEED, PIPE_W, BIRD_X])

  useEffect(() => {
    if (!started || over) return
    if (!pipes.length || pipes[pipes.length - 1].x < W - DIST)
      setPipes(ps => [...ps, createPipe()])
    const birdCollide = pipes.some(
      p =>
        p.x < BIRD_X + BIRD &&
        p.x + PIPE_W > BIRD_X &&
        (birdY < p.y || birdY + BIRD > p.y + GAP)
    )
    if (birdY + BIRD > H || birdY < 0 || birdCollide) {
      setOver(true)
      if (score > high) {
        setHigh(score)
        localStorage.setItem('highscore', score)
        setShowCongrats(true)
        setTimeout(() => setShowCongrats(false), 3000)
        if (user && setUser) {
          const stats = Array.isArray(user.stats) ? [...user.stats] : []
          const idx = stats.findIndex(s => s.name === 'Flappy Bird')
          if (idx !== -1) {
            stats[idx] = {
              ...stats[idx],
              bestScore: score,
              played: stats[idx].played + 1,
            }
          } else {
            stats.push({ name: 'Flappy Bird', bestScore: score, played: 1 })
          }
          setUser({ ...user, stats })
          localStorage.setItem('user', JSON.stringify({ ...user, stats }))
        }
      } else if (user && setUser) {
        const stats = Array.isArray(user.stats) ? [...user.stats] : []
        const idx = stats.findIndex(s => s.name === 'Flappy Bird')
        if (idx !== -1) {
          stats[idx] = {
            ...stats[idx],
            played: stats[idx].played + 1,
          }
        } else {
          stats.push({ name: 'Flappy Bird', bestScore: high, played: 1 })
        }
        setUser({ ...user, stats })
        localStorage.setItem('user', JSON.stringify({ ...user, stats }))
      }
    }
  }, [
    birdY,
    pipes,
    started,
    over,
    score,
    high,
    createPipe,
    user,
    setUser,
    W,
    DIST,
    BIRD,
    PIPE_W,
    BIRD_X,
    GAP,
    H,
  ])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-2 sm:p-4'>
      <h1 className='text-3xl sm:text-5xl font-extrabold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in text-center'>
        🐦 Flappy Bird
      </h1>
      {!started ? (
        <button
          onClick={() => setStarted(true)}
          className='px-4 py-2 sm:px-8 sm:py-4 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition transform hover:scale-105 text-base sm:text-xl'
        >
          ▶️ Ойынды бастау
        </button>
      ) : (
        <>
          <div
            className='relative border-4 border-gray-700 rounded-lg overflow-hidden shadow-lg w-full max-w-[500px] mx-auto'
            style={{ maxWidth: W, height: H }}
            onClick={flap}
          >
            <div
              className='absolute bg-yellow-400 rounded-full shadow-md animate-bounce'
              style={{ top: birdY, left: BIRD_X, width: BIRD, height: BIRD }}
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
                <div className='bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 bg-opacity-80 rounded-xl shadow-2xl border-4 border-yellow-400 px-4 py-3 sm:px-8 sm:py-6 flex items-center justify-center animate-fade-in-up'>
                  <h2 className='text-2xl sm:text-4xl font-bold text-yellow-700 drop-shadow-lg animate-pulse text-center'>
                    🎉 Жаңа рекорд! 🎉
                  </h2>
                </div>
              </div>
            )}
          </div>
          <p className='mt-4 sm:mt-6 text-lg sm:text-2xl font-bold drop-shadow-md text-center'>
            🏆 Ұпай: <span className='text-yellow-300'>{score}</span>
          </p>
          <p className='text-base sm:text-lg drop-shadow-md text-center'>
            🎖 Ең жоғары ұпай: <span className='text-green-300'>{high}</span>
          </p>
        </>
      )}
      {over && (
        <div className='mt-6 sm:mt-8 p-3 sm:p-6 bg-gray-800 text-white rounded-lg shadow-xl text-center animate-fade-in w-full max-w-[400px]'>
          <h2 className='text-xl sm:text-3xl font-bold text-red-400 mb-2 sm:mb-4'>
            Ойын аяқталды! 😢
          </h2>
          <button
            onClick={restart}
            className='mt-2 sm:mt-4 px-4 py-2 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 text-base sm:text-xl'
          >
            🔄 Қайта бастау
          </button>
        </div>
      )}
    </div>
  )
}
