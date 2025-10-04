import express from 'express'
import Product from '../models/Product.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// GET /api/products - Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured
    } = req.query

    // Build filter object
    const filter = { isActive: true }
    
    if (category && category !== 'all') {
      filter.category = category
    }
    
    if (search) {
      filter.$text = { $search: search }
    }
    
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }
    
    if (featured === 'true') {
      filter.featured = true
    }

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Product.countDocuments(filter)
    ])

    const totalPages = Math.ceil(totalProducts / parseInt(limit))

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    })
  }
})

// GET /api/products/categories - Get all product categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true })
    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    })
  }
})

// GET /api/products/featured - Get featured products
router.get('/featured', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ 
      isActive: true, 
      featured: true 
    })
    .sort({ createdAt: -1 })
    .limit(8)
    .select('-__v')

    res.json({
      success: true,
      data: featuredProducts
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    })
  }
})

// GET /api/products/:id - Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v')
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product is not available'
      })
    }

    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    })
  }
})

// POST /api/products - Create new product (Admin only - simplified for demo)
router.post('/', [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description must be 1-500 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'food']).withMessage('Invalid category'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      })
    }

    const product = new Product(req.body)
    await product.save()

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    })
  }
})

// PUT /api/products/:id - Update product (Admin only - simplified for demo)
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('description').optional().trim().isLength({ min: 1, max: 500 }).withMessage('Description must be 1-500 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'food']).withMessage('Invalid category'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    })
  } catch (error) {
    console.error('Error updating product:', error)
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    })
  }
})

// DELETE /api/products/:id - Delete product (Admin only - simplified for demo)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    })
  }
})

export default router
