import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { LogIn } from 'lucide-react'

export function SignIn() {
  const { signIn, user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true })
    }
  }, [user, loading, navigate, from])

  const handleGoogleSignIn = async () => {
    try {
      await signIn()
    } catch (error) {
      console.error('Failed to sign in', error)
      alert('Failed to sign in. Please try again.')
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-wine-100 bg-white p-8 shadow-sm text-center">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-wine-900 mb-2">
          Welcome to Elsewise
        </h1>
        <p className="text-mauve-600 mb-8">
          Sign in to explore perspectives and improve your thinking.
        </p>
        
        <Button 
          onClick={handleGoogleSignIn} 
          disabled={loading}
          className="w-full py-6 text-lg flex items-center justify-center gap-3"
          variant="primary"
        >
          <LogIn className="h-5 w-5" />
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </div>
    </div>
  )
}
