# LocalStore - Modern E-commerce Website

A modern, colorful, and futuristic e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js) using Vite for the frontend.

## 🚀 Features

- **Modern UI/UX**: Colorful, futuristic design with glassmorphism effects
- **Product Browsing**: Browse products with filtering by category, search, and price range
- **Product Details**: Detailed product pages with images, descriptions, and specifications
- **Shopping Cart**: Add/remove items, update quantities, persistent cart storage
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Dynamic cart updates and product availability
- **Search & Filter**: Advanced product search and filtering capabilities

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for modern icons
- **CSS3** with custom animations and glassmorphism effects

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **CORS** for cross-origin requests
- **Express Validator** for input validation
- **RESTful API** design

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd LocalEcommerce
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with your MongoDB connection string
# The .env file is already created with default values

# Seed the database with sample products
npm run seed

# Start the backend server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🗄️ Database Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will connect to `mongodb://localhost:27017/localecommerce`

### Option 2: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in `backend/.env`

### Seed Sample Data
```bash
cd backend
npm run seed
```

This will populate your database with 12 sample products across different categories.

## 🚀 Running the Application

1. **Start the Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

2. **Start the Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

3. **Open your browser** and navigate to `http://localhost:3000`

## 📱 API Endpoints

### Products
- `GET /api/products` - Get all products with filtering and pagination
- `GET /api/products/:id` - Get single product by ID
- `GET /api/products/categories` - Get all product categories
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart/:sessionId` - Get cart by session ID
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart/clear/:sessionId` - Clear entire cart

### Health Check
- `GET /api/health` - API health check

## 🎨 Design Features

- **Glassmorphism Effects**: Modern glass-like UI elements
- **Gradient Backgrounds**: Beautiful color gradients throughout the app
- **Smooth Animations**: CSS animations for better user experience
- **Responsive Grid**: Products displayed in a responsive grid layout
- **Modern Typography**: Clean and readable font choices
- **Color Scheme**: Vibrant and modern color palette
- **Interactive Elements**: Hover effects and smooth transitions

## 📁 Project Structure

```
LocalEcommerce/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context for state management
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # Express routes
│   ├── scripts/            # Utility scripts
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables (Backend)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/localecommerce
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

### Vite Configuration (Frontend)
The frontend is configured to proxy API requests to the backend server running on port 5000.

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
```

### Backend Deployment
Make sure to:
1. Set production environment variables
2. Use a production MongoDB database
3. Configure CORS for your production domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Make sure MongoDB is running
   - Check your connection string in `.env`

2. **Port Already in Use**
   - Change the port in `.env` (backend) or `vite.config.js` (frontend)

3. **CORS Errors**
   - Make sure the backend CORS is configured correctly
   - Check the proxy configuration in `vite.config.js`

4. **Products Not Loading**
   - Run the seed script: `npm run seed` in the backend directory
   - Check if the backend server is running

## 📞 Support

For support, please create an issue in the repository or contact the development team.

---

**Happy Shopping! 🛒✨**
