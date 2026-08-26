import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBMmhDw5rgijQ817tHg_sWmzmNiIyBhJWA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "elsewise-4d87a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "elsewise-4d87a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "elsewise-4d87a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1027401074178",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1027401074178:web:100fd9e93a1d03ea2e091b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZLWS0D9FNJ"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
