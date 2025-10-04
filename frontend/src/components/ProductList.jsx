import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react'
import { useCart } from '../context/CartContext'
import axios from 'axios'
import './ProductList.css'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products')
      // Handle both direct array and wrapped response formats
      const productsData = response.data.data || response.data || []
      setProducts(Array.isArray(productsData) ? productsData : [])
      setLoading(false)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to fetch products')
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    // Show success animation
    const button = document.querySelector(`[data-product-id="${product._id}"]`)
    if (button) {
      button.classList.add('added')
      setTimeout(() => button.classList.remove('added'), 1000)
    }
  }

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === 'all' || product.category === category
    return matchesSearch && matchesCategory
  }) : []

  const categories = ['all', ...new Set(Array.isArray(products) ? products.map(product => product.category).filter(Boolean) : [])]

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="product-list-container">
      <div className="hero-section">
        <h1 className="hero-title gradient-text">Welcome to LocalStore</h1>
        <p className="hero-subtitle">Discover amazing products from your local community</p>
      </div>

      <div className="filters-section glass">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product._id} className="product-card glass fade-in">
            <div className="product-image-container">
              <img
                src={product.image || '/api/placeholder/300/200'}
                alt={product.name}
                className="product-image"
              />
              <div className="product-overlay">
                <Link to={`/product/${product._id}`} className="view-btn">
                  <Eye size={16} />
                  View Details
                </Link>
              </div>
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating || 4.5) ? 'star-filled' : 'star-empty'}
                  />
                ))}
                <span className="rating-text">({product.rating || 4.5})</span>
              </div>
              
              <div className="product-footer">
                <div className="price-container">
                  <span className="price">${product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">${product.originalPrice}</span>
                  )}
                </div>
                
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  data-product-id={product._id}
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default ProductList
