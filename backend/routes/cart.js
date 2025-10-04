import express from 'express'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Helper function to generate session ID
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// GET /api/cart/:sessionId - Get cart by session ID
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    
    const cart = await Cart.findOne({ sessionId }).populate('items.product', 'name price image category')
    
    if (!cart) {
      return res.json({
        success: true,
        data: {
          sessionId,
          items: [],
          totalAmount: 0,
          totalItems: 0
        }
      })
    }

    res.json({
      success: true,
      data: cart
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    })
  }
})

// POST /api/cart/add - Add item to cart
router.post('/add', [
  body('sessionId').optional().isString().withMessage('Session ID must be a string'),
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
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

    let { sessionId, productId, quantity = 1 } = req.body
    
    // Generate session ID if not provided
    if (!sessionId) {
      sessionId = generateSessionId()
    }

    // Check if product exists and is active
    const product = await Product.findById(productId)
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or not available'
      })
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      })
    }

    // Find or create cart
    let cart = await Cart.findOne({ sessionId })
    
    if (!cart) {
      cart = new Cart({
        sessionId,
        items: []
      })
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    )

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity
      
      // Check total stock availability
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Cannot add more items. Insufficient stock available'
        })
      }
      
      cart.items[existingItemIndex].quantity = newQuantity
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      })
    }

    await cart.save()
    
    // Populate product details for response
    await cart.populate('items.product', 'name price image category')

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    })
  } catch (error) {
    console.error('Error adding item to cart:', error)
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    })
  }
})

// PUT /api/cart/update - Update item quantity in cart
router.put('/update', [
  body('sessionId').isString().withMessage('Session ID is required'),
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be non-negative')
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

    const { sessionId, productId, quantity } = req.body

    const cart = await Cart.findOne({ sessionId })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    )

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      })
    }

    if (quantity === 0) {
      // Remove item from cart
      cart.items.splice(itemIndex, 1)
    } else {
      // Check stock availability
      const product = await Product.findById(productId)
      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Product not found or not available'
        })
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock available'
        })
      }

      // Update quantity
      cart.items[itemIndex].quantity = quantity
      cart.items[itemIndex].price = product.price // Update price in case it changed
    }

    await cart.save()
    await cart.populate('items.product', 'name price image category')

    res.json({
      success: true,
      message: 'Cart updated successfully',
      data: cart
    })
  } catch (error) {
    console.error('Error updating cart:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    })
  }
})

// DELETE /api/cart/remove - Remove item from cart
router.delete('/remove', [
  body('sessionId').isString().withMessage('Session ID is required'),
  body('productId').isMongoId().withMessage('Invalid product ID')
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

    const { sessionId, productId } = req.body

    const cart = await Cart.findOne({ sessionId })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    )

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      })
    }

    cart.items.splice(itemIndex, 1)
    await cart.save()
    await cart.populate('items.product', 'name price image category')

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    })
  } catch (error) {
    console.error('Error removing item from cart:', error)
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    })
  }
})

// DELETE /api/cart/clear/:sessionId - Clear entire cart
router.delete('/clear/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params

    const cart = await Cart.findOne({ sessionId })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }

    cart.items = []
    await cart.save()

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    })
  } catch (error) {
    console.error('Error clearing cart:', error)
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    })
  }
})

export default router
