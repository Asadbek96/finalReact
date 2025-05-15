import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import GamesPanel from './components/GamesPanel'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import AuthPanel from './components/AuthPanel'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return <h1>Бір нәрсе дұрыс болмады. Бетті қайта жүктеңіз.</h1>
    }
    return this.props.children
  }
}

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to='/login' replace />
}

export default function AppRouter({
  user,
  setUser,
  selectedGame,
  setSelectedGame,
}) {
  if (user === undefined) return <div>Жүктелуде...</div>

  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path='/login'
          element={
            user ? <Navigate to='/' replace /> : <AuthPanel onAuth={setUser} />
          }
        />
        <Route
          path='/'
          element={
            <ProtectedRoute user={user}>
              <GamesPanel
                selectedGame={selectedGame}
                setSelectedGame={setSelectedGame}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/settings'
          element={
            <ProtectedRoute user={user}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path='*'
          element={<Navigate to={user ? '/' : '/login'} replace />}
        />
      </Routes>
    </ErrorBoundary>
  )
}
