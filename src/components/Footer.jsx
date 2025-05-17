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
    <footer className='w-full bg-gray-900 text-white dark:bg-gray-100 dark:text-black py-4 sm:py-6'>
      <div className='max-w-6xl mx-auto px-2 sm:px-4 flex flex-col sm:flex-row justify-between items-center gap-3'>
        <p className='text-xs xs:text-sm sm:text-base text-center sm:text-left'>
          © 2025 MiniGames. Барлық құқықтар қорғалған.
        </p>
        <div className='flex items-center space-x-2 xs:space-x-3 sm:space-x-4 mt-3 sm:mt-0'>
          <button
            onClick={() => setShowChat(true)}
            className='flex items-center gap-1 xs:gap-2 px-3 py-1.5 xs:px-4 xs:py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition font-semibold text-xs xs:text-sm sm:text-base'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 xs:h-5 xs:w-5'
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
            <span className='hidden xs:inline'>Бізбен байланысыңыз</span>
            <span className='inline xs:hidden'>Чат</span>
          </button>
          <a
            href='https://github.com'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-400 hover:text-gray-300 dark:text-gray-600 dark:hover:text-gray-500 transition text-xs xs:text-sm sm:text-base'
          >
            GitHub
          </a>
        </div>
      </div>
      {showChat && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-2'>
          <div className='bg-gray-800 text-white rounded-lg shadow-lg p-2 xs:p-4 w-full max-w-xs xs:max-w-sm sm:max-w-md animate-fade-in'>
            <h2 className='text-lg xs:text-xl sm:text-2xl font-bold mb-3 xs:mb-4 text-center text-blue-400'>
              Бізбен байланысыңыз
            </h2>
            <div className='h-48 xs:h-56 sm:h-64 bg-gray-700 rounded-lg p-2 xs:p-4 overflow-y-auto'>
              {chatHistory.map((chat, i) => (
                <p
                  key={i}
                  className={`mb-2 ${
                    chat.sender === 'user'
                      ? 'text-right text-blue-500'
                      : 'text-left text-gray-300'
                  } text-xs xs:text-sm sm:text-base`}
                >
                  {chat.text}
                </p>
              ))}
              {loading && (
                <p className='text-gray-400 italic text-xs xs:text-sm'>
                  Жазып жатыр...
                </p>
              )}
            </div>
            <div className='mt-3 xs:mt-4 flex'>
              <input
                type='text'
                placeholder='Хабарлама енгізіңіз...'
                value={message}
                onChange={e => setMessage(e.target.value)}
                className='flex-grow p-2 xs:p-3 rounded-l-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white text-xs xs:text-sm sm:text-base'
                onKeyDown={e => e.key === 'Enter' && send()}
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={loading}
                className='px-3 xs:px-6 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600 transition transform hover:scale-105 disabled:opacity-50 text-xs xs:text-sm sm:text-base'
              >
                Жіберу
              </button>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className='mt-3 xs:mt-4 px-4 xs:px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition transform hover:scale-105 w-full text-xs xs:text-sm sm:text-base'
            >
              Жабу
            </button>
          </div>
        </div>
      )}
    </footer>
  )
}
