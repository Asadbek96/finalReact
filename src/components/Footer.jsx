import React, { useState } from 'react'

export default function Footer() {
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!message.trim()) return
    setChatHistory(h => [...h, { sender: 'user', text: message }])
    setMessage('')
    setLoading(true)
    try {
      const res = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' +
          import.meta.env.VITE_GEMINI_API_KEY,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: message }] }],
          }),
        }
      )
      const data = await res.json()
      setChatHistory(h => [
        ...h,
        {
          sender: 'gemini',
          text:
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Қате: ЖИ жауап ала алмады.',
        },
      ])
    } catch {
      setChatHistory(h => [
        ...h,
        {
          sender: 'gemini',
          text: 'Қате орын алды. Кейінірек қайталап көріңіз.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className='w-full bg-gray-900 text-white dark:bg-gray-100 dark:text-black py-6'>
      <div className='max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center'>
        <p className='text-sm sm:text-base'>
          © 2025 MiniGames. Барлық құқықтар қорғалған.
        </p>
        <div className='flex items-center space-x-4 mt-4 sm:mt-0'>
          <button
            onClick={() => setShowChat(true)}
            className='flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition font-semibold'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-4A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
              />
            </svg>
            Бізбен байланысыңыз
          </button>
          <a
            href='https://github.com'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-400 hover:text-gray-300 dark:text-gray-600 dark:hover:text-gray-500 transition'
          >
            GitHub
          </a>
        </div>
      </div>
      {showChat && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fade-in'>
            <h2 className='text-2xl font-bold mb-4 text-center text-blue-400'>
              Бізбен байланысыңыз
            </h2>
            <div className='h-64 bg-gray-700 rounded-lg p-4 overflow-y-auto'>
              {chatHistory.map((chat, i) => (
                <p
                  key={i}
                  className={`mb-2 ${
                    chat.sender === 'user'
                      ? 'text-right text-blue-500'
                      : 'text-left text-gray-300'
                  }`}
                >
                  {chat.text}
                </p>
              ))}
              {loading && (
                <p className='text-gray-400 italic'>Жазып жатыр...</p>
              )}
            </div>
            <div className='mt-4 flex'>
              <input
                type='text'
                placeholder='Хабарлама енгізіңіз...'
                value={message}
                onChange={e => setMessage(e.target.value)}
                className='flex-grow p-3 rounded-l-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white'
                onKeyDown={e => e.key === 'Enter' && send()}
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={loading}
                className='px-6 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600 transition transform hover:scale-105 disabled:opacity-50'
              >
                Жіберу
              </button>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className='mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition transform hover:scale-105 w-full'
            >
              Жабу
            </button>
          </div>
        </div>
      )}
    </footer>
  )
}
