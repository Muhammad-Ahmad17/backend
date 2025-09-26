const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET categories summary with product counts
router.get('/categories/summary', async (req, res) => {
    try {
        const { VALID_CATEGORIES } = require('../middleware/validation');
        const categorySummary = [];

        for (const category of VALID_CATEGORIES) {
            const count = await Product.countDocuments({ category: category });
            categorySummary.push({
                category: category,
                name: category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                count: count,
                endpoint: `/api/products/category/${category}`
            });
        }

        res.json({
            success: true,
            message: 'Categories summary fetched successfully',
            totalCategories: VALID_CATEGORIES.length,
            categories: categorySummary
        });
    } catch (error) {
        console.error('Error fetching categories summary:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories summary',
            error: error.message
        });
    }
});

module.exports = router;