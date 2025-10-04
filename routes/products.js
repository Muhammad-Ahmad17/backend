const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { validateProduct, checkValidationResult } = require('../middleware/validation');
const { requireAuth } = require('../middleware/auth');

// GET products by category (dynamic route)
router.get('/category/:categoryName', async (req, res) => {
    try {
        const categoryName = req.params.categoryName.toLowerCase();
        const { VALID_CATEGORIES } = require('../middleware/validation');

        if (!VALID_CATEGORIES.includes(categoryName)) {
            return res.status(400).json({
                success: false,
                message: `❌ Invalid category. Available categories: ${VALID_CATEGORIES.join(', ')}`
            });
        }

        const products = await Product.find({ category: categoryName }).sort({ createdAt: -1 });

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
            status: product.status,
            createdAt: product.createdAt
        }));

        res.json({
            success: true,
            category: categoryName,
            count: productsJSON.length,
            products: productsJSON
        });

    } catch (error) {
        console.error('❌ Error fetching category products:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error fetching products: ' + error.message
        });
    }
});

// GET products by category for management
router.get('/category/:categoryName/manage', async (req, res) => {
    try {
        const categoryName = req.params.categoryName.toLowerCase();
        const { VALID_CATEGORIES } = require('../middleware/validation');

        if (!VALID_CATEGORIES.includes(categoryName)) {
            return res.status(400).json({
                success: false,
                message: `❌ Invalid category. Available categories: ${VALID_CATEGORIES.join(', ')}`
            });
        }

        const products = await Product.find({ category: categoryName }).sort({ createdAt: -1 });

        const productsForManagement = products.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category,
            subcategory: product.subcategory,
            description: product.description.substring(0, 100) + '...',
            status: product.status,
            featured: product.featured,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }));

        res.json({
            success: true,
            category: categoryName,
            categoryDisplay: categoryName.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            count: productsForManagement.length,
            products: productsForManagement
        });

    } catch (error) {
        console.error('❌ Error fetching products for management:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error fetching products: ' + error.message
        });
    }
});

// GET products by subcategory
router.get('/subcategory/:categoryName/:subcategoryName', async (req, res) => {
    try {
        const categoryName = req.params.categoryName.toLowerCase();
        const subcategoryName = req.params.subcategoryName;
        const { VALID_CATEGORIES, SUBCATEGORIES } = require('../middleware/validation');

        if (!VALID_CATEGORIES.includes(categoryName)) {
            return res.status(400).json({
                success: false,
                message: `❌ Invalid category. Available categories: ${VALID_CATEGORIES.join(', ')}`
            });
        }

        if (!SUBCATEGORIES[categoryName] || !SUBCATEGORIES[categoryName].includes(subcategoryName)) {
            return res.status(400).json({
                success: false,
                message: `❌ Invalid subcategory for ${categoryName}. Available subcategories: ${SUBCATEGORIES[categoryName]?.join(', ') || 'none'}`
            });
        }

        const products = await Product.find({
            category: categoryName,
            subcategory: subcategoryName
        }).sort({ createdAt: -1 });

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
            status: product.status,
            createdAt: product.createdAt
        }));

        res.json({
            success: true,
            category: categoryName,
            subcategory: subcategoryName,
            count: productsJSON.length,
            products: productsJSON
        });

    } catch (error) {
        console.error('❌ Error fetching subcategory products:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error fetching products: ' + error.message
        });
    }
});

// GET products by category and subcategory (alternative endpoint)
router.get('/:category/:subcategory', async (req, res) => {
    try {
        const { category, subcategory } = req.params;
        const { VALID_CATEGORIES, SUBCATEGORIES } = require('../middleware/validation');

        // Decode URI components
        const decodedCategory = decodeURIComponent(category).toLowerCase();
        const decodedSubcategory = decodeURIComponent(subcategory);

        if (!VALID_CATEGORIES.includes(decodedCategory)) {
            return res.status(400).json({ success: false, message: 'Invalid category.' });
        }

        if (!SUBCATEGORIES[decodedCategory] || !SUBCATEGORIES[decodedCategory].includes(decodedSubcategory)) {
            return res.status(400).json({ success: false, message: 'Invalid subcategory for the given category.' });
        }

        const products = await Product.find({
            category: decodedCategory,
            subcategory: decodedSubcategory
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found for this category and subcategory.' });
        }

        res.json({
            success: true,
            count: products.length,
            products: products
        });

    } catch (error) {
        console.error('Error fetching products by subcategory:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching products.' });
    }
});

// UPDATE product by category and ID
router.put('/category/:categoryName/:id', requireAuth, async (req, res) => {
    try {
        const categoryName = req.params.categoryName.toLowerCase();
        const productId = req.params.id;
        const { VALID_CATEGORIES } = require('../middleware/validation');

        if (!VALID_CATEGORIES.includes(categoryName)) {
            return res.status(400).json({
                success: false,
                message: `❌ Invalid category. Available categories: ${VALID_CATEGORIES.join(', ')}`
            });
        }

        const updateFields = {};
        if (req.body.name) updateFields.name = req.body.name.trim();
        if (req.body.description) updateFields.description = req.body.description.trim();
        if (req.body.subcategory) updateFields.subcategory = req.body.subcategory.trim();
        if (req.body.printingMethod) updateFields.printingMethod = req.body.printingMethod.trim();
        if (req.body.minimumQuantity) updateFields.minimumQuantity = parseInt(req.body.minimumQuantity);
        if (req.body.featured !== undefined) updateFields.featured = req.body.featured === 'true' || req.body.featured === true;

        if (req.body.colours) {
            updateFields.colours = Array.isArray(req.body.colours) ? req.body.colours : [req.body.colours];
        }
        if (req.body.sizes && Array.isArray(req.body.sizes)) {
            updateFields.sizes = req.body.sizes;
        }
        if (req.body.tags) {
            updateFields.tags = Array.isArray(req.body.tags)
                ? req.body.tags.filter(t => t.trim())
                : req.body.tags.split(',').map(t => t.trim()).filter(t => t);
        }

        console.log(`🔄 Updating ${categoryName} product:`, productId, 'with fields:', updateFields);

        const updatedProduct = await Product.findOneAndUpdate(
            { id: productId, category: categoryName },
            updateFields,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: `✅ ${categoryName} product updated successfully!`,
            category: categoryName,
            product: updatedProduct
        });

    } catch (error) {
        console.error('❌ Error updating product:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: '❌ Validation error: ' + errors.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: '❌ Error updating product: ' + error.message
        });
    }
});

// DELETE product by category and ID
router.delete('/category/:categoryName/:id', requireAuth, async (req, res) => {
    try {
        const categoryName = req.params.categoryName.toLowerCase();
        const productId = req.params.id;
        const { VALID_CATEGORIES } = require('../middleware/validation');
        const { deleteImage, extractPublicId } = require('../config/cloudinary');

        if (!VALID_CATEGORIES.includes(categoryName)) {
            return res.status(400).json({
                success: false,
                message: `❌ Invalid category. Available categories: ${VALID_CATEGORIES.join(', ')}`
            });
        }

        const product = await Product.findOne({ id: productId, category: categoryName });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `❌ Product not found in ${categoryName} category`
            });
        }

        console.log(`🗑️ Deleting ${categoryName} product:`, productId);

        // Delete images from Cloudinary if they exist
        for (const imageUrl of product.pictures || []) {
            try {
                const publicId = extractPublicId(imageUrl);
                if (publicId) {
                    await deleteImage(publicId);
                    console.log('🗑️ Deleted image:', publicId);
                }
            } catch (deleteError) {
                console.error('❌ Error deleting image:', deleteError);
            }
        }

        // Delete product from database
        await Product.findOneAndDelete({ id: productId, category: categoryName });
        console.log(`✅ ${categoryName} product deleted successfully:`, productId);

        res.json({
            success: true,
            message: `✅ ${categoryName} product deleted successfully!`,
            category: categoryName,
            deletedId: productId
        });

    } catch (error) {
        console.error('❌ Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error deleting product: ' + error.message
        });
    }
});

module.exports = router;