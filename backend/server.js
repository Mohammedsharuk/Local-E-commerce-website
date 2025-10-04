import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Import routes
import productRoutes from './routes/products.js'
import cartRoutes from './routes/cart.js'

// Configure dotenv
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://superb-shortbread-f5ab05.netlify.app'
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files (for product images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// API Routes
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)

// Placeholder image endpoint
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params
  res.redirect(`https://via.placeholder.com/${width}x${height}/4ecdc4/ffffff?text=Product+Image`)
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LocalStore API is running',
    timestamp: new Date().toISOString()
  })
})

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/localecommerce'

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB')
  
  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`)
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`)
  })
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('❌ Unhandled Promise Rejection:', err.message)
  process.exit(1)
})

export default app
