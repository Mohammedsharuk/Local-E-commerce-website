import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { useCart } from '../context/CartContext'
import api from '../config/api'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/products/${id}`)
      // Handle both direct object and wrapped response formats
      const productData = response.data.data || response.data
      setProduct(productData)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Failed to fetch product details')
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    // Show success message
    const button = document.querySelector('.add-to-cart-btn')
    if (button) {
      button.classList.add('added')
      setTimeout(() => button.classList.remove('added'), 1000)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <div className="error">{error || 'Product not found'}</div>
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="product-detail-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="product-detail-content">
        <div className="product-image-section">
          <div className="main-image-container">
            <img
              src={product.image || `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/placeholder/500/400`}
              alt={product.name}
              className="main-image"
            />
          </div>
        </div>

        <div className="product-info-section glass">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.floor(product.rating || 4.5) ? 'star-filled' : 'star-empty'}
                />
              ))}
              <span className="rating-text">({product.rating || 4.5}) • 127 reviews</span>
            </div>
          </div>

          <div className="price-section">
            <div className="current-price">${product.price}</div>
            {product.originalPrice && (
              <div className="original-price">${product.originalPrice}</div>
            )}
            {product.originalPrice && (
              <div className="discount">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </div>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-features">
            <div className="feature">
              <Truck className="feature-icon" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="feature">
              <Shield className="feature-icon" />
              <span>1 year warranty included</span>
            </div>
            <div className="feature">
              <RotateCcw className="feature-icon" />
              <span>30-day return policy</span>
            </div>
          </div>

          <div className="purchase-section">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button className="wishlist-btn">
                <Heart size={18} />
              </button>
            </div>
          </div>

          <div className="product-specs">
            <h3>Specifications</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Category:</span>
                <span className="spec-value">{product.category}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Brand:</span>
                <span className="spec-value">{product.brand || 'LocalStore'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">SKU:</span>
                <span className="spec-value">{product._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Availability:</span>
                <span className="spec-value in-stock">In Stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
