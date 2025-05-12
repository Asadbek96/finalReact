import React, { useState } from 'react'

export default function Footer() {
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const openChat = () => setShowChat(true)
  const closeChat = () => {
    setShowChat(false)
    setMessage('')
  }

  const handleSendMessage = async () => {
    if (message.trim() === '') return

    const userMessage = { sender: 'user', text: message }
    setChatHistory(prev => [...prev, userMessage])
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' +
          import.meta.env.VITE_GEMINI_API_KEY,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: message }],
              },
            ],
          }),
        }
      )

      const data = await res.json()
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        setChatHistory(prev => [
          ...prev,
          { sender: 'gemini', text: data.candidates[0].content.parts[0].text },
        ])
      } else {
        setChatHistory(prev => [
          ...prev,
          {
            sender: 'gemini',
            text: 'Қате: ЖИ жауап ала алмады.',
          },
        ])
        console.error('Gemini жауабы:', data)
      }
    } catch (error) {
      console.error('Gemini API-ге сұрау кезінде қате орын алды:', error)
      setChatHistory(prev => [
        ...prev,
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
            onClick={openChat}
            className='text-blue-400 hover:text-blue-500 dark:text-blue-600 dark:hover:text-blue-700 transition'
          >
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
              Gemini ЖИ чаты
            </h2>
            <div className='h-64 bg-gray-700 rounded-lg p-4 overflow-y-auto'>
              {chatHistory.map((chat, index) => (
                <p
                  key={index}
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
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className='px-6 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600 transition transform hover:scale-105 disabled:opacity-50'
              >
                Жіберу
              </button>
            </div>
            <button
              onClick={closeChat}
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
