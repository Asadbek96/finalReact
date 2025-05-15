import React, { useEffect, useState } from 'react'

const symbols = ['🐱', '🐶', '🐸', '🐵', '🐯', '🦊']
const generateCards = () =>
  [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5)
    .map((symbol, i) => ({
      id: i,
      symbol,
      flipped: false,
      matched: false,
    }))

export default function MemoryGame() {
  const [cards, setCards] = useState(generateCards())
  const [selected, setSelected] = useState([])
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [won, setWon] = useState(false)
  const [time, setTime] = useState(0)
  const [timerOn, setTimerOn] = useState(false)
  const [scoreHistory, setScoreHistory] = useState([])
  const [bestTime, setBestTime] = useState(
    () => Number(localStorage.getItem('memory_best_time')) || null
  )
  const [showCongrats, setShowCongrats] = useState(false)

  useEffect(() => {
    if (!timerOn || won) return
    const t = setInterval(() => setTime(t => t + 1), 1000)
    return () => clearInterval(t)
  }, [timerOn, won])

  useEffect(() => {
    if (selected.length !== 2) return
    setLocked(true)
    const [a, b] = selected
    if (cards[a].symbol === cards[b].symbol) {
      const newCards = cards.map((c, i) =>
        i === a || i === b ? { ...c, matched: true } : c
      )
      setCards(newCards)
      setSelected([])
      setLocked(false)
      if (newCards.every(c => c.matched)) {
        setWon(true)
        setTimerOn(false)
        setScoreHistory(h => [...h, time])
        if (bestTime === null || time < bestTime) {
          setBestTime(time)
          localStorage.setItem('memory_best_time', time)
          setShowCongrats(true)
          setTimeout(() => setShowCongrats(false), 3000)
        }
      }
    } else {
      setTimeout(() => {
        setCards(cards =>
          cards.map((c, i) =>
            i === a || i === b ? { ...c, flipped: false } : c
          )
        )
        setSelected([])
        setLocked(false)
      }, 800)
    }
    setMoves(m => m + 1)
  }, [selected])

  const flipCard = i => {
    if (locked || selected.includes(i) || cards[i].flipped || cards[i].matched)
      return
    if (!timerOn) setTimerOn(true)
    setCards(cs =>
      cs.map((c, idx) => (idx === i ? { ...c, flipped: true } : c))
    )
    setSelected(sel => [...sel, i])
  }

  const resetGame = () => {
    setCards(generateCards())
    setSelected([])
    setMoves(0)
    setTime(0)
    setWon(false)
    setTimerOn(false)
    setLocked(false)
    setShowCongrats(false)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-6'>
      <h1 className='text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in'>
        🧠 Есте сақтау ойыны
      </h1>
      <div className='relative'>
        <div className='grid grid-cols-4 gap-4'>
          {cards.map((card, i) => (
            <div
              key={card.id}
              onClick={() => flipCard(i)}
              className={`w-24 h-24 text-3xl flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 shadow-lg ${
                card.flipped || card.matched
                  ? 'bg-white text-black scale-105'
                  : 'bg-gray-800 hover:scale-105 hover:bg-gray-700'
              }`}
            >
              {(card.flipped || card.matched) && card.symbol}
            </div>
          ))}
        </div>
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
      <div className='mt-6 text-lg'>
        <p>
          Қадам саны: <span className='font-bold text-yellow-400'>{moves}</span>
        </p>
        <p>
          Уақыт: <span className='font-bold text-green-400'>{time} сек</span>
        </p>
        <p>
          Ең үздік нәтиже:{' '}
          <span className='font-bold text-pink-400'>
            {bestTime !== null ? `${bestTime} сек` : '—'}
          </span>
        </p>
      </div>
      {won && (
        <div className='mt-6 text-2xl font-bold text-green-400 animate-pulse'>
          Жарайсың! Барлығы {time} секундта аяқтадың 🎉
        </div>
      )}
      <button
        onClick={resetGame}
        className='mt-8 px-8 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105'
      >
        🔄 Қайта бастау
      </button>
      <div className='mt-8'>
        <h3 className='text-xl font-bold mb-4'>Тарих:</h3>
        <ul className='list-disc list-inside'>
          {scoreHistory.map((t, i) => (
            <li key={i} className='text-lg'>
              Ойын {i + 1}: {t} секунд
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
