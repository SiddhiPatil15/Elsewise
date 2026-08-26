import { Request, Response, NextFunction } from 'express'
import { auth } from '../firebase.js'

export interface AuthRequest extends Request {
  user?: {
    uid: string
    email?: string
    name?: string
    picture?: string
  }
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!auth) {
    console.error('Firebase Auth is not initialized. Check FIREBASE_SERVICE_ACCOUNT_BASE64.')
    return res.status(500).json({ error: 'Authentication service is unavailable' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' })
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await auth.verifyIdToken(token)
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture
    }
    next()
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error)
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }
}
