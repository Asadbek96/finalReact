import React, { useEffect, useState } from 'react'

const generateCards = () => {
  const symbols = ['🐱', '🐶', '🐸', '🐵', '🐯', '🦊']
  const doubleCards = [...symbols, ...symbols]
  return doubleCards
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({
      id: index,
      symbol,
      flipped: false,
      matched: false,
    }))
}

export default function MemoryGame() {
  const [cards, setCards] = useState(generateCards())
  const [selected, setSelected] = useState([])
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [won, setWon] = useState(false)
  const [time, setTime] = useState(0)
  const [timerOn, setTimerOn] = useState(false)
  const [scoreHistory, setScoreHistory] = useState([])

  useEffect(() => {
    let timer
    if (timerOn && !won) {
      timer = setInterval(() => {
        setTime(t => t + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [timerOn, won])

  useEffect(() => {
    if (selected.length === 2) {
      setLocked(true)
      const [first, second] = selected
      if (cards[first].symbol === cards[second].symbol) {
        const newCards = [...cards]
        newCards[first].matched = true
        newCards[second].matched = true
        setCards(newCards)
        setSelected([])
        setLocked(false)
        if (newCards.every(card => card.matched)) {
          setWon(true)
          setTimerOn(false)
          setScoreHistory(prevHistory => [...prevHistory, time])
        }
      } else {
        setTimeout(() => {
          const newCards = [...cards]
          newCards[first].flipped = false
          newCards[second].flipped = false
          setCards(newCards)
          setSelected([])
          setLocked(false)
        }, 800)
      }
      setMoves(m => m + 1)
    }
  }, [selected])

  const flipCard = index => {
    if (
      locked ||
      selected.includes(index) ||
      cards[index].flipped ||
      cards[index].matched
    )
      return
    if (!timerOn) setTimerOn(true)
    const newCards = [...cards]
    newCards[index].flipped = true
    setCards(newCards)
    setSelected([...selected, index])
  }

  const resetGame = () => {
    setCards(generateCards())
    setSelected([])
    setMoves(0)
    setTime(0)
    setWon(false)
    setTimerOn(false)
    setLocked(false)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-transparent text-white p-6'>
      <h1 className='text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-fade-in'>
        🧠 Есте сақтау ойыны
      </h1>

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

      <div className='mt-6 text-lg'>
        <p>
          Қадам саны: <span className='font-bold text-yellow-400'>{moves}</span>
        </p>
        <p>
          Уақыт: <span className='font-bold text-green-400'>{time} сек</span>
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
          {scoreHistory.map((time, index) => (
            <li key={index} className='text-lg'>
              Ойын {index + 1}: {time} секунд
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
