import admin from 'firebase-admin'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8')
      )
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      })
    } else {
      console.warn('FIREBASE_SERVICE_ACCOUNT_BASE64 is not set. Firebase Admin SDK will not be initialized.')
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error)
  }
}

export const db = admin.apps.length ? admin.firestore() : null
export const auth = admin.apps.length ? admin.auth() : null
