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

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col relative">
      <VantaBackground />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewOpinion />} />
          <Route path="/analyzing/:id" element={<Analyzing />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/compare" element={<CompareAI />} />
          <Route path="/history" element={<History />} />
          <Route path="/think-lab" element={<ThinkLab />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
