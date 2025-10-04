const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const productsRoutes = require('./products');
const categoriesRoutes = require('./categories');
const summaryRoutes = require('./summary');
const uploadsRoutes = require('./uploads');

// Public routes (no authentication required)
router.use('/', authRoutes);
router.use('/', categoriesRoutes);

// Protected routes (authentication required)
const { requireAuth } = require('../middleware/auth');
router.use('/products', requireAuth, productsRoutes);
router.use('/', requireAuth, summaryRoutes);
router.use('/', requireAuth, uploadsRoutes);

// Handle the specific products-json endpoint (protected)
router.get('/products-json', requireAuth, async (req, res) => {
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