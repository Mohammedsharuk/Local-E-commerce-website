import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Store, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import './Header.css'

const Header = () => {
  const { getCartItemsCount } = useCart()
  const itemCount = getCartItemsCount()

  return (
    <header className="header glass">
      <div className="header-container">
        <Link to="/" className="logo">
          <Store className="logo-icon" />
          <span className="logo-text gradient-text">LocalStore</span>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">
            <span>Products</span>
          </Link>
          <Link to="/cart" className="nav-link cart-link">
            <ShoppingCart className="cart-icon" />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="cart-badge pulse">{itemCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
