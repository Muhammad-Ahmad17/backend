const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { upload, deleteImage, extractPublicId } = require('../config/cloudinary');

// Validation middleware
const validateProductData = (req, res, next) => {
    const { id, name, description, category, subcategory, colours, printingMethod, sizes, minimumQuantity } = req.body;

    if (!id || id.trim().length < 2 || id.trim().length > 20) {
        return res.status(400).json({
            success: false,
            message: '❌ Product ID must be between 2 and 20 characters'
        });
    }

    if (!name || name.trim().length < 2 || name.trim().length > 100) {
        return res.status(400).json({
            success: false,
            message: '❌ Product name must be between 2 and 100 characters'
        });
    }

    if (!description || description.trim().length < 10 || description.trim().length > 1000) {
        return res.status(400).json({
            success: false,
            message: '❌ Description must be between 10 and 1000 characters'
        });
    }

    if (!category || !['sports-wear', 'gym-wear', 'fitness-wear', 'streetwear', 'fashion-wear', 'mma-arts', 'accessories'].includes(category)) {
        return res.status(400).json({
            success: false,
            message: '❌ Please select a valid category'
        });
    }

    if (!subcategory || subcategory.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: '❌ Subcategory is required'
        });
    }

    if (!colours || !Array.isArray(colours) || colours.length === 0) {
        return res.status(400).json({
            success: false,
            message: '❌ At least one colour must be provided'
        });
    }

    if (!printingMethod || printingMethod.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: '❌ Printing method is required'
        });
    }

    if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
        return res.status(400).json({
            success: false,
            message: '❌ At least one size must be provided'
        });
    }

    if (!minimumQuantity || isNaN(minimumQuantity) || parseInt(minimumQuantity) < 1) {
        return res.status(400).json({
            success: false,
            message: '❌ Minimum quantity must be at least 1'
        });
    }

    next();
};

// GET all products
router.get('/products-json', async (req, res) => {
    try {
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
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
});

// GET single product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            product: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
});

// POST create product
router.post('/create-product', (req, res) => {
    upload.array('images', 5)(req, res, async function (err) {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({
                success: false,
                message: '❌ Error uploading images: ' + err.message
            });
        }

        try {
            // Parse form data
            const { id, name, description, category, subcategory, minimumQuantity, featured } = req.body;

            // Parse arrays from form data
            const colours = req.body.colours ? (typeof req.body.colours === 'string' ? [req.body.colours] : req.body.colours) : [];
            const sizes = req.body.sizes ? (typeof req.body.sizes === 'string' ? [req.body.sizes] : req.body.sizes) : [];
            const tags = req.body.tags ? req.body.tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t) : [];

            // Get uploaded image URLs from Cloudinary
            const pictures = req.files ? req.files.map(file => file.path) : [];

            // Create new product
            const newProduct = new Product({
                id: id.trim(),
                name: name.trim(),
                category: category,
                subcategory: subcategory.trim(),
                description: description.trim(),
                pictures: pictures,
                colours: colours,
                printingMethod: req.body.printingMethod ? req.body.printingMethod.trim() : '',
                sizes: sizes,
                minimumQuantity: parseInt(minimumQuantity),
                featured: featured === 'true' || featured === true,
                tags: tags,
                status: 'active'
            });

            await newProduct.save();
            console.log('✅ Product created successfully:', newProduct.id);

            res.json({
                success: true,
                message: '✅ Product created successfully!',
                product: newProduct
            });

        } catch (dbError) {
            console.error('❌ Database error:', dbError);

            // Handle validation errors
            if (dbError.name === 'ValidationError') {
                const errors = Object.values(dbError.errors).map(err => err.message);
                return res.status(400).json({
                    success: false,
                    message: '❌ Validation error: ' + errors.join(', ')
                });
            }

            // Handle duplicate key error
            if (dbError.code === 11000) {
                if (dbError.keyPattern && dbError.keyPattern.id) {
                    return res.status(400).json({
                        success: false,
                        message: '❌ Product ID already exists. Please use a different ID.'
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: '❌ Duplicate product detected'
                });
            }

            res.status(500).json({
                success: false,
                message: '❌ Error creating product: ' + dbError.message
            });
        }
    });
});

// POST create product (JSON endpoint)
router.post('/create-product-json', async (req, res) => {
    try {
        const { id, name, category, subcategory, description, colours, printingMethod, sizes, minimumQuantity, featured, tags } = req.body;

        // Validate required fields
        if (!id || !name || !category || !subcategory || !description) {
            return res.status(400).json({
                success: false,
                message: '❌ Missing required fields'
            });
        }

        // Create new product
        const newProduct = new Product({
            id: id.trim(),
            name: name.trim(),
            category: category,
            subcategory: subcategory.trim(),
            description: description.trim(),
            pictures: [],
            colours: colours || [],
            printingMethod: printingMethod || '',
            sizes: sizes || [],
            minimumQuantity: parseInt(minimumQuantity) || 1,
            featured: featured === true,
            tags: tags || [],
            status: 'active'
        });

        await newProduct.save();
        console.log('✅ Product created successfully:', newProduct.id);

        res.json({
            success: true,
            message: '✅ Product created successfully!',
            product: newProduct
        });

    } catch (dbError) {
        console.error('❌ Database error:', dbError);

        if (dbError.name === 'ValidationError') {
            const errors = Object.values(dbError.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: '❌ Validation error: ' + errors.join(', ')
            });
        }

        if (dbError.code === 11000) {
            return res.status(400).json({
                success: false,
                message: '❌ Product ID already exists. Please use a different ID.'
            });
        }

        res.status(500).json({
            success: false,
            message: '❌ Error creating product: ' + dbError.message
        });
    }
});

// PUT update product
router.put('/products/:id', validateProductData, async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: '❌ Product not found'
            });
        }

        // Update only provided fields
        const updateFields = {};

        // Update basic fields if provided
        if (req.body.name) updateFields.name = req.body.name.trim();
        if (req.body.description) updateFields.description = req.body.description.trim();
        if (req.body.category) updateFields.category = req.body.category;
        if (req.body.subcategory) updateFields.subcategory = req.body.subcategory.trim();
        if (req.body.minimumQuantity) updateFields.minimumQuantity = parseInt(req.body.minimumQuantity);
        if (req.body.status) updateFields.status = req.body.status;
        if (req.body.featured !== undefined) updateFields.featured = req.body.featured === 'true' || req.body.featured === true;
        if (req.body.printingMethod) updateFields.printingMethod = req.body.printingMethod.trim();

        // Process array fields
        if (req.body.colours) {
            updateFields.colours = Array.isArray(req.body.colours) ? req.body.colours : [req.body.colours];
        }
        if (req.body.sizes) {
            updateFields.sizes = Array.isArray(req.body.sizes) ? req.body.sizes : [req.body.sizes];
        }
        if (req.body.tags) {
            updateFields.tags = req.body.tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
        }

        updateFields.updatedAt = new Date();

        console.log('🔄 Updating product:', req.params.id, 'with fields:', updateFields);

        const updatedProduct = await Product.findOneAndUpdate(
            { id: req.params.id },
            updateFields,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: '✅ Product updated successfully!',
            product: updatedProduct
        });

    } catch (error) {
        console.error('❌ Error updating product:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: '❌ Validation error: ' + errors.join(', ')
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            if (error.keyPattern && error.keyPattern.productCode) {
                return res.status(400).json({
                    success: false,
                    message: '❌ Product code already exists. Please use a different code.'
                });
            }
        }

        res.status(500).json({
            success: false,
            message: '❌ Error updating product: ' + error.message
        });
    }
});

// DELETE product
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: '❌ Product not found'
            });
        }

        console.log('🗑️ Deleting product:', req.params.id);

        // Delete images from Cloudinary
        for (const imageUrl of product.pictures) {
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
        await Product.findOneAndDelete({ id: req.params.id });
        console.log('✅ Product deleted successfully:', req.params.id);

        res.json({
            success: true,
            message: '✅ Product deleted successfully!'
        });

    } catch (error) {
        console.error('❌ Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: '❌ Error deleting product: ' + error.message
        });
    }
});

// Health check route
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API is running successfully',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Category-specific API endpoints
const categories = [
    'sports-wear',
    'gym-wear',
    'fitness-wear',
    'streetwear',
    'fashion-wear',
    'mma-arts',
    'accessories'
];

// GET products by category - Sports Wear
router.get('/products/category/sports-wear', async (req, res) => {
    try {
        const products = await Product.find({ category: 'sports-wear' }).sort({ createdAt: -1 });

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
            tags: product.tags || []
        }));

        res.json({
            success: true,
            category: 'sports-wear',
            count: productsJSON.length,
            products: productsJSON
        });
    } catch (error) {
        console.error('Error fetching sports wear products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sports wear products',
            error: error.message
        });
    }
});

// GET products by category - Gym Wear
router.get('/products/category/gym-wear', async (req, res) => {
    try {
        const products = await Product.find({ category: 'gym-wear' }).sort({ createdAt: -1 });

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
            tags: product.tags || []
        }));

        res.json({
            success: true,
            category: 'gym-wear',
            count: productsJSON.length,
            products: productsJSON
        });
    } catch (error) {
        console.error('Error fetching gym wear products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gym wear products',
            error: error.message
        });
    }
});

// GET products by category - Fitness Wear
router.get('/products/category/fitness-wear', async (req, res) => {
    try {
        const products = await Product.find({ category: 'fitness-wear' }).sort({ createdAt: -1 });

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
            tags: product.tags || []
        }));

        res.json({
            success: true,
            category: 'fitness-wear',
            count: productsJSON.length,
            products: productsJSON
        });
    } catch (error) {
        console.error('Error fetching fitness wear products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching fitness wear products',
            error: error.message
        });
    }
});

// GET products by category - Streetwear
router.get('/products/category/streetwear', async (req, res) => {
    try {
        const products = await Product.find({ category: 'streetwear' }).sort({ createdAt: -1 });

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
            tags: product.tags || []
        }));

        res.json({
            success: true,
            category: 'streetwear',
            count: productsJSON.length,
            products: productsJSON
        });
    } catch (error) {
        console.error('Error fetching streetwear products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching streetwear products',
            error: error.message
        });
    }
});

// GET products by category - Fashion Wear
router.get('/products/category/fashion-wear', async (req, res) => {
    try {
        const products = await Product.find({ category: 'fashion-wear' }).sort({ createdAt: -1 });

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
            tags: product.tags || []
        }));

        res.json({
            success: true,
            category: 'fashion-wear',
            count: productsJSON.length,
            products: productsJSON
        });
    } catch (error) {
        console.error('Error fetching fashion wear products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching fashion wear products',
            error: error.message
        });
    }
});

// GET products by category - MMA Arts
router.get('/products/category/mma-arts', async (req, res) => {
    try {
        const products = await Product.find({ category: 'mma-arts' }).sort({ createdAt: -1 });

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
            tags: product.tags || []
        }));

        res.json({
            success: true,
            category: 'mma-arts',
            count: productsJSON.length,
            products: productsJSON
        });
    } catch (error) {
        console.error('Error fetching MMA arts products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching MMA arts products',
            error: error.message
        });
    }
});

// GET products by category - Accessories
router.get('/products/category/accessories', async (req, res) => {
    try {
        const products = await Product.find({ category: 'accessories' }).sort({ createdAt: -1 });

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
            tags: product.tags || []
        }));

        res.json({
            success: true,
            category: 'accessories',
            count: productsJSON.length,
            products: productsJSON
        });
    } catch (error) {
        console.error('Error fetching accessories products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching accessories products',
            error: error.message
        });
    }
});

// GET all categories with product counts
router.get('/categories/summary', async (req, res) => {
    try {
        const categorySummary = [];

        for (const category of categories) {
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
            totalCategories: categories.length,
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

// Category-wise product management endpoints
// GET products by category for update/delete operations
router.get('/products/category/:categoryName/manage', async (req, res) => {
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
            products: productsForManagement,
            message: `✅ Found ${productsForManagement.length} products in ${categoryName} category`
        });
    } catch (error) {
        console.error(`Error fetching ${req.params.categoryName} products for management:`, error);
        res.status(500).json({
            success: false,
            message: `❌ Error fetching ${req.params.categoryName} products`,
            error: error.message
        });
    }
});

// Generic endpoint to get products by any category (dynamic) - For frontend consumption
router.get('/products/category/:categoryName', async (req, res) => {
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
            tags: product.tags || []
        }));

        res.json({
            success: true,
            category: categoryName,
            categoryDisplay: categoryName.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            count: productsJSON.length,
            products: productsJSON
        });
    } catch (error) {
        console.error(`Error fetching ${req.params.categoryName} products:`, error);
        res.status(500).json({
            success: false,
            message: `❌ Error fetching ${req.params.categoryName} products`,
            error: error.message
        });
    }
});

// PUT update product within category
router.put('/products/category/:categoryName/:id', async (req, res) => {
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

        const product = await Product.findOne({ id: productId, category: categoryName });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `❌ Product not found in ${categoryName} category`
            });
        }

        // Update only provided fields
        const updateFields = { updatedAt: new Date() };

        if (req.body.name) updateFields.name = req.body.name.trim();
        if (req.body.description) updateFields.description = req.body.description.trim();
        if (req.body.subcategory) updateFields.subcategory = req.body.subcategory.trim();
        if (req.body.minimumQuantity) updateFields.minimumQuantity = parseInt(req.body.minimumQuantity);
        if (req.body.status) updateFields.status = req.body.status;
        if (req.body.featured !== undefined) updateFields.featured = req.body.featured === 'true' || req.body.featured === true;
        if (req.body.printingMethod) updateFields.printingMethod = req.body.printingMethod.trim();

        // Process array fields
        if (req.body.colours && Array.isArray(req.body.colours)) {
            updateFields.colours = req.body.colours.filter(c => c.trim());
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

// DELETE product within category
router.delete('/products/category/:categoryName/:id', async (req, res) => {
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