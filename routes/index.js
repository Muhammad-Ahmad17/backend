const express = require('express');
const router = express.Router();

// Import all route modules
const productsRoutes = require('./products');
const categoriesRoutes = require('./categories');
const summaryRoutes = require('./summary');
const uploadsRoutes = require('./uploads');

// Mount routes with their respective prefixes
router.use('/products', productsRoutes);
router.use('/', categoriesRoutes);
router.use('/', summaryRoutes);
router.use('/', uploadsRoutes);

// Handle the specific products-json endpoint
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