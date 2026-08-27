import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { VantaBackground } from './components/layout/VantaBackground'
import { Home } from './pages/Home'
import { NewOpinion } from './pages/NewOpinion'
import { Analyzing } from './pages/Analyzing'
import { Results } from './pages/Results'
import { CompareAI } from './pages/CompareAI'
import { History } from './pages/History'
import { ThinkLab } from './pages/ThinkLab'
import { SignIn } from './pages/SignIn'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col relative text-warm-800 dark:text-plum-100 transition-colors duration-300">
        <VantaBackground />
        <ScrollToTop />
        <Navbar />
        <main className="flex-1 relative z-10">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/new" element={<ProtectedRoute><NewOpinion /></ProtectedRoute>} />
            <Route path="/analyzing/:id" element={<ProtectedRoute><Analyzing /></ProtectedRoute>} />
            <Route path="/results/:id" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/compare" element={<ProtectedRoute><CompareAI /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/think-lab" element={<ProtectedRoute><ThinkLab /></ProtectedRoute>} />
          </Routes>
        </main>
        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </AuthProvider>
  )
}

