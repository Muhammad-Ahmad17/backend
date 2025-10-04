const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { upload, deleteImage, extractPublicId } = require('../config/cloudinary');
const { validateProduct, checkValidationResult, handleUploadError } = require('../middleware/validation');
const { requireAuth } = require('../middleware/auth');

// CREATE product with image upload
router.post('/create-product', requireAuth, upload.array('images', 5), handleUploadError, (req, res, next) => {
    console.log('🔍 FULL REQUEST BODY INSPECTION:');
    console.log('================================');
    console.log('Raw req.body:', JSON.stringify(req.body, null, 2));
    console.log('Individual fields:');
    console.log('- id:', req.body.id, '(type:', typeof req.body.id, ')');
    console.log('- name:', req.body.name, '(type:', typeof req.body.name, ')');
    console.log('- category:', req.body.category, '(type:', typeof req.body.category, ')');
    console.log('- subcategory:', req.body.subcategory, '(type:', typeof req.body.subcategory, ')');
    console.log('- description:', req.body.description, '(type:', typeof req.body.description, ')');
    console.log('- colours:', req.body.colours, '(type:', typeof req.body.colours, ', isArray:', Array.isArray(req.body.colours), ')');
    console.log('- printingMethod:', req.body.printingMethod, '(type:', typeof req.body.printingMethod, ')');
    console.log('- sizes:', req.body.sizes, '(type:', typeof req.body.sizes, ', isArray:', Array.isArray(req.body.sizes), ')');
    console.log('- minimumQuantity:', req.body.minimumQuantity, '(type:', typeof req.body.minimumQuantity, ')');
    console.log('- featured:', req.body.featured, '(type:', typeof req.body.featured, ')');
    console.log('- tags:', req.body.tags, '(type:', typeof req.body.tags, ', isArray:', Array.isArray(req.body.tags), ')');
    console.log('- files:', req.files ? req.files.length : 0, 'files uploaded');
    console.log('================================');
    next();
}, validateProduct, checkValidationResult, async (req, res) => {
    try {
        const { id, name, description, category, subcategory, colours, printingMethod, sizes, minimumQuantity, featured, tags } = req.body;

        // Check if product ID already exists
        const existingProduct = await Product.findOne({ id: id.trim() });
        if (existingProduct) {
            // Clean up uploaded images if product ID exists
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    try {
                        const publicId = extractPublicId(file.path);
                        if (publicId) await deleteImage(publicId);
                    } catch (deleteError) {
                        console.error('❌ Error deleting uploaded image:', deleteError);
                    }
                }
            }

            return res.status(400).json({
                success: false,
                message: '❌ Product ID already exists. Please use a different ID.'
            });
        }

        // Get image URLs from uploaded files
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        // Process colours - ensure it's an array
        let processedColours = [];
        if (Array.isArray(colours)) {
            processedColours = colours;
        } else if (typeof colours === 'string' && colours.trim()) {
            processedColours = [colours.trim()];
        }

        // Process sizes - ensure it's an array  
        let processedSizes = [];
        if (Array.isArray(sizes)) {
            processedSizes = sizes;
        } else if (typeof sizes === 'string' && sizes.trim()) {
            processedSizes = [sizes.trim()];
        }

        console.log('📝 Creating product with processed data:', {
            id: id.trim(),
            name: name.trim(),
            category: category.trim(),
            subcategory: subcategory.trim(),
            colours: processedColours,
            sizes: processedSizes,
            imageCount: imageUrls.length
        });

        // Create new product
        const newProduct = new Product({
            id: id.trim(),
            name: name.trim(),
            description: description.trim(),
            category: category.trim(),
            subcategory: subcategory.trim(),
            colours: processedColours,
            printingMethod: printingMethod.trim(),
            sizes: processedSizes,
            minimumQuantity: parseInt(minimumQuantity),
            featured: featured === 'true' || featured === true,
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
            pictures: imageUrls,
            status: 'active'
        });

        const savedProduct = await newProduct.save();
        console.log('✅ Product created successfully:', savedProduct.id);

        res.status(201).json({
            success: true,
            message: '✅ Product created successfully!',
            product: {
                id: savedProduct.id,
                name: savedProduct.name,
                category: savedProduct.category,
                subcategory: savedProduct.subcategory,
                pictures: savedProduct.pictures,
                createdAt: savedProduct.createdAt
            }
        });

    } catch (error) {
        console.error('❌ Error creating product:', error);

        // Clean up uploaded images on error
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const publicId = extractPublicId(file.path);
                    if (publicId) await deleteImage(publicId);
                } catch (deleteError) {
                    console.error('❌ Error deleting uploaded image:', deleteError);
                }
            }
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: '❌ Product ID already exists. Please use a different ID.'
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: '❌ Validation error: ' + errors.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: '❌ Error creating product: ' + error.message
        });
    }
});

// CREATE product (JSON format - no image upload)
router.post('/create-product-json', requireAuth, validateProduct, checkValidationResult, async (req, res) => {
    try {
        const { id, name, category, subcategory, description, colours, printingMethod, sizes, minimumQuantity, featured, tags } = req.body;

        // Check if product ID already exists
        const existingProduct = await Product.findOne({ id: id.trim() });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: '❌ Product ID already exists. Please use a different ID.'
            });
        }

        console.log('📝 Creating product (JSON):', {
            id: id.trim(),
            name: name.trim(),
            category: category.trim(),
            subcategory: subcategory.trim(),
            colours: colours,
            sizes: sizes
        });

        // Create new product
        const newProduct = new Product({
            id: id.trim(),
            name: name.trim(),
            description: description.trim(),
            category: category.trim(),
            subcategory: subcategory.trim(),
            colours: colours || [],
            printingMethod: printingMethod.trim(),
            sizes: sizes || [],
            minimumQuantity: parseInt(minimumQuantity),
            featured: featured || false,
            tags: tags || [],
            pictures: [], // No images for JSON creation
            status: 'active'
        });

        const savedProduct = await newProduct.save();
        console.log('✅ Product created successfully (JSON):', savedProduct.id);

        res.status(201).json({
            success: true,
            message: '✅ Product created successfully!',
            product: {
                id: savedProduct.id,
                name: savedProduct.name,
                category: savedProduct.category,
                subcategory: savedProduct.subcategory,
                createdAt: savedProduct.createdAt
            }
        });

    } catch (error) {
        console.error('❌ Error creating product (JSON):', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: '❌ Product ID already exists. Please use a different ID.'
            });
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: '❌ Validation error: ' + errors.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: '❌ Error creating product: ' + error.message
        });
    }
});

module.exports = router;