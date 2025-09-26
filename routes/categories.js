const express = require('express');
const router = express.Router();

// GET all available categories with their subcategories
router.get('/categories', async (req, res) => {
    try {
        const { VALID_CATEGORIES, SUBCATEGORIES } = require('../middleware/validation');

        const categoriesData = VALID_CATEGORIES.map(category => ({
            name: category,
            displayName: category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            subcategories: SUBCATEGORIES[category] || []
        }));

        res.json({
            success: true,
            categories: categoriesData
        });

    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error fetching categories: ' + error.message
        });
    }
});

// GET categories and subcategories structure
router.get('/categories-structure', (req, res) => {
    const { SUBCATEGORIES } = require('../middleware/validation');

    res.json({
        success: true,
        categories: SUBCATEGORIES,
        totalCategories: Object.keys(SUBCATEGORIES).length,
        totalSubcategories: Object.values(SUBCATEGORIES).reduce((sum, subs) => sum + subs.length, 0)
    });
});

// GET all subcategories for a specific category
router.get('/subcategories/:categoryName', async (req, res) => {
    try {
        const categoryName = req.params.categoryName.toLowerCase();
        const { VALID_CATEGORIES, SUBCATEGORIES } = require('../middleware/validation');

        if (!VALID_CATEGORIES.includes(categoryName)) {
            return res.status(400).json({
                success: false,
                message: `❌ Invalid category. Available categories: ${VALID_CATEGORIES.join(', ')}`
            });
        }

        const subcategories = SUBCATEGORIES[categoryName] || [];

        res.json({
            success: true,
            category: categoryName,
            subcategories: subcategories
        });

    } catch (error) {
        console.error('❌ Error fetching subcategories:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error fetching subcategories: ' + error.message
        });
    }
});

module.exports = router;