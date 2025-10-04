const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const productsRoutes = require('./products');
const categoriesRoutes = require('./categories');
const summaryRoutes = require('./summary');
const uploadsRoutes = require('./uploads');

// Import authentication middleware
const { requireAuth } = require('../middleware/auth');

// Public routes (no authentication required)
router.use('/', authRoutes);
router.use('/', categoriesRoutes);
router.use('/', summaryRoutes); // Summary routes are now public (read-only data)

// Products routes - Mixed (GET public, POST/PUT/DELETE protected)
router.use('/products', productsRoutes);

// Protected routes (authentication required - only write operations)
router.use('/', requireAuth, uploadsRoutes);

// Handle the specific products-json endpoint (public for GET)
router.get('/products-json', async (req, res) => {
    try {
        const Product = require('../models/Product');
        const products = await Product.find({}).sort({ createdAt: -1 });

        const productsJSON = products.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category,
            subcategory: product.subcategory,
            description: product.description,
            pictures: product.pictures || [],
            colours: product.colours || [],
            printingMethod: product.printingMethod,
            sizes: product.sizes || [],
            minimumQuantity: product.minimumQuantity,
            featured: product.featured,
            tags: product.tags || [],
            status: product.status
        }));

        res.json({
            success: true,
            count: productsJSON.length,
            products: productsJSON
        });
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error fetching products: ' + error.message
        });
    }
});

module.exports = router;