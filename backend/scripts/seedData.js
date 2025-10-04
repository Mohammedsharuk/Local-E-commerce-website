import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'

dotenv.config()

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 89.99,
    originalPrice: 129.99,
    category: "electronics",
    brand: "TechSound",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop",
    rating: 4.5,
    numReviews: 127,
    stock: 50,
    featured: true,
    tags: ["wireless", "bluetooth", "headphones", "music"]
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes. Perfect for everyday wear.",
    price: 24.99,
    originalPrice: 34.99,
    category: "clothing",
    brand: "EcoWear",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=400&fit=crop",
    rating: 4.3,
    numReviews: 89,
    stock: 100,
    featured: false,
    tags: ["organic", "cotton", "t-shirt", "sustainable"]
  },
  {
    name: "JavaScript: The Complete Guide",
    description: "Comprehensive guide to modern JavaScript programming. Covers ES6+, async programming, and best practices for web development.",
    price: 39.99,
    originalPrice: 59.99,
    category: "books",
    brand: "TechBooks",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=400&fit=crop",
    rating: 4.8,
    numReviews: 234,
    stock: 25,
    featured: true,
    tags: ["javascript", "programming", "web development", "coding"]
  },
  {
    name: "Smart Home LED Light Bulbs",
    description: "WiFi-enabled smart LED bulbs with 16 million colors. Control with voice commands or smartphone app. Energy efficient.",
    price: 19.99,
    originalPrice: 29.99,
    category: "home",
    brand: "SmartHome",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
    rating: 4.2,
    numReviews: 156,
    stock: 75,
    featured: false,
    tags: ["smart", "led", "home", "wifi", "energy efficient"]
  },
  {
    name: "Professional Yoga Mat",
    description: "Non-slip yoga mat made from eco-friendly materials. Perfect grip and cushioning for all yoga practices and workouts.",
    price: 34.99,
    originalPrice: 49.99,
    category: "sports",
    brand: "YogaLife",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=400&fit=crop",
    rating: 4.6,
    numReviews: 98,
    stock: 40,
    featured: true,
    tags: ["yoga", "mat", "fitness", "eco-friendly", "exercise"]
  },
  {
    name: "Natural Face Moisturizer",
    description: "Hydrating face moisturizer with natural ingredients. Suitable for all skin types. Cruelty-free and paraben-free formula.",
    price: 28.99,
    originalPrice: 39.99,
    category: "beauty",
    brand: "NaturalGlow",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=400&fit=crop",
    rating: 4.4,
    numReviews: 167,
    stock: 60,
    featured: false,
    tags: ["moisturizer", "natural", "skincare", "cruelty-free"]
  },
  {
    name: "Educational Building Blocks Set",
    description: "Creative building blocks set for children. Develops problem-solving skills and creativity. Safe, non-toxic materials.",
    price: 45.99,
    originalPrice: 65.99,
    category: "toys",
    brand: "KidsCreate",
    image: "https://images.unsplash.com/photo-1558877385-1c3e4e0e0b6d?w=500&h=400&fit=crop",
    rating: 4.7,
    numReviews: 203,
    stock: 30,
    featured: true,
    tags: ["building blocks", "educational", "toys", "children", "creative"]
  },
  {
    name: "Organic Green Tea",
    description: "Premium organic green tea leaves. Rich in antioxidants and natural flavor. Sourced from sustainable tea gardens.",
    price: 16.99,
    originalPrice: 24.99,
    category: "food",
    brand: "TeaGarden",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=400&fit=crop",
    rating: 4.5,
    numReviews: 145,
    stock: 80,
    featured: false,
    tags: ["green tea", "organic", "antioxidants", "healthy", "natural"]
  },
  {
    name: "4K Webcam for Streaming",
    description: "Ultra HD 4K webcam with auto-focus and built-in microphone. Perfect for streaming, video calls, and content creation.",
    price: 79.99,
    originalPrice: 99.99,
    category: "electronics",
    brand: "StreamTech",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=400&fit=crop",
    rating: 4.3,
    numReviews: 112,
    stock: 35,
    featured: false,
    tags: ["webcam", "4k", "streaming", "video calls", "content creation"]
  },
  {
    name: "Designer Denim Jacket",
    description: "Classic denim jacket with modern fit. Made from premium denim fabric. Versatile piece for any wardrobe.",
    price: 68.99,
    originalPrice: 89.99,
    category: "clothing",
    brand: "UrbanStyle",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=400&fit=crop",
    rating: 4.4,
    numReviews: 87,
    stock: 45,
    featured: true,
    tags: ["denim", "jacket", "fashion", "classic", "versatile"]
  },
  {
    name: "Cookbook: Healthy Meals",
    description: "Collection of 100+ healthy and delicious recipes. Easy-to-follow instructions with nutritional information included.",
    price: 22.99,
    originalPrice: 32.99,
    category: "books",
    brand: "HealthyEats",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=400&fit=crop",
    rating: 4.6,
    numReviews: 178,
    stock: 55,
    featured: false,
    tags: ["cookbook", "healthy", "recipes", "nutrition", "cooking"]
  },
  {
    name: "Aromatherapy Diffuser",
    description: "Ultrasonic essential oil diffuser with LED lights. Creates a relaxing atmosphere with your favorite scents.",
    price: 32.99,
    originalPrice: 45.99,
    category: "home",
    brand: "RelaxHome",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=400&fit=crop",
    rating: 4.5,
    numReviews: 134,
    stock: 65,
    featured: true,
    tags: ["aromatherapy", "diffuser", "essential oils", "relaxation", "home"]
  }
]

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/localecommerce'
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log('✅ Connected to MongoDB')

    // Clear existing products
    await Product.deleteMany({})
    console.log('🗑️  Cleared existing products')

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts)
    console.log(`✅ Created ${createdProducts.length} sample products`)

    // Display created products
    console.log('\n📦 Sample Products Created:')
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`)
    })

    console.log('\n🎉 Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
