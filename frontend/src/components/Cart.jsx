import React from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import './Cart.css'

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here!')
    // In a real app, this would integrate with a payment processor
  }

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart glass">
          <ShoppingBag size={64} className="empty-cart-icon" />
          <h2 className="empty-cart-title">Your cart is empty</h2>
          <p className="empty-cart-text">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/" className="continue-shopping-btn">
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title gradient-text">Shopping Cart</h1>
        <button className="clear-cart-btn" onClick={clearCart}>
          <Trash2 size={16} />
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map(item => (
            <div key={item._id} className="cart-item glass fade-in">
              <div className="item-image-container">
                <img
                  src={item.image || `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/placeholder/100/100`}
                  alt={item.name}
                  className="item-image"
                />
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-price">${item.price}</div>
              </div>
              
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                >
                  <Minus size={16} />
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item._id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary glass">
          <h3 className="summary-title">Order Summary</h3>
          
          <div className="summary-row">
            <span>Subtotal ({items.length} items)</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">Free</span>
          </div>
          
          <div className="summary-row">
            <span>Tax</span>
            <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
          </div>
          
          <hr className="summary-divider" />
          
          <div className="summary-row total-row">
            <span>Total</span>
            <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
          </div>
          
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          
          <Link to="/" className="continue-shopping-link">
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
