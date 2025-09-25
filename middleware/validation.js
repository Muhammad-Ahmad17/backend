const { body, validationResult } = require('express-validator');

/**
 * Frontend-focused Product Validation Middleware
 * Validates all product fields that affect frontend display and functionality
 * Optimized for category-based product management system
 */

// Available product categories for validation
const VALID_CATEGORIES = [
    'sports-wear', 'gym-wear', 'fitness-wear',
    'streetwear', 'fashion-wear', 'mma-arts', 'accessories'
];

const SUBCATEGORIES = {
    'sports-wear': [
        'T-Shirts', 'Shorts', 'Jerseys', 'Uniforms', 'Tank Tops', 'Hoodies', 'Track Suits'
    ],
    'gym-wear': [
        'Tank Tops', 'Leggings', 'Sports Bras', 'Gym Shorts', 'Hoodies', 'Tracksuits', 'Joggers'
    ],
    'fitness-wear': [
        'Yoga Sets', 'Compression Wear', 'Running Shorts', 'Fitness Tops', 'Athletic Wear'
    ],
    'streetwear': [
        'T-Shirts', 'Hoodies', 'Sweatshirts', 'Casual Shorts', 'Joggers', 'Tank Tops'
    ],
    'fashion-wear': [
        'Jackets', 'Casual Wear', 'Designer Tops', 'Fashion Accessories'
    ],
    'mma-arts': [
        'MMA Shorts', 'Rash Guards', 'MMA Gloves', 'Fighting Gear', 'Training Wear'
    ],
    'accessories': [
        'Bags', 'Caps', 'Socks', 'Gloves', 'Belts'
    ]
};

// Available product sizes for validation
const VALID_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

/**
 * Core product validation rules for frontend forms
 * These rules ensure data integrity and proper frontend display
 */
const validateProduct = [
    // Product ID validation - user-defined identifier
    body('id')
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage('Product ID must be between 2 and 20 characters')
        .matches(/^[a-zA-Z0-9-_]+$/)
        .withMessage('Product ID can only contain letters, numbers, hyphens, and underscores'),

    // Product name validation - displayed on frontend
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),

    // Category validation - critical for frontend filtering
    body('category')
        .trim()
        .isIn(VALID_CATEGORIES)
        .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),

    // Subcategory validation - secondary classification
    body('subcategory')
        .trim()
        .custom((value, { req }) => {
            const category = req.body.category;
            if (!SUBCATEGORIES[category] || !SUBCATEGORIES[category].includes(value)) {
                throw new Error(`Invalid subcategory for the selected category.`);
            }
            return true;
        }),

    // Description validation - product details
    body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),

    // Colors validation - user-defined colors array
    body('colours')
        .isArray({ min: 1 })
        .withMessage('At least one colour must be provided'),

    body('colours.*')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Each colour must not be empty'),

    // Printing method validation - manufacturing specification
    body('printingMethod')
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Printing method must be between 2 and 200 characters'),

    // Sizes validation - multiple selection allowed
    body('sizes')
        .isArray({ min: 1 })
        .withMessage('At least one size must be provided'),

    body('sizes.*')
        .trim()
        .isIn(VALID_SIZES)
        .withMessage(`Each size must be one of: ${VALID_SIZES.join(', ')}`),

    // Minimum quantity validation - business rule
    body('minimumQuantity')
        .isInt({ min: 1, max: 1000 })
        .withMessage('Minimum quantity must be between 1 and 1000'),

    // Featured status validation - optional boolean
    body('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean value'),

    // Tags validation - optional array for SEO and filtering
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),

    body('tags.*')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Each tag must not be empty')
];

/**
 * Middleware to process validation results
 * Returns user-friendly error messages for frontend display
 */
const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: '❌ Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

/**
 * Middleware for handling file upload errors 
 * Provides clear error messages for image upload issues
 */
const handleUploadError = (error, req, res, next) => {
    if (error) {
        console.error('Upload error:', error);

        if (error.message === 'Only image files are allowed!') {
            return res.status(400).json({
                success: false,
                message: '❌ Only image files are allowed (JPG, PNG, WebP)'
            });
        }

        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: '❌ File size too large. Maximum size is 5MB per image'
            });
        }

        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: '❌ Too many files. Maximum 5 images allowed'
            });
        }

        return res.status(500).json({
            success: false,
            message: '❌ File upload error',
            error: error.message
        });
    }
    next();
};

/**
 * Category-specific validation for update operations
 * Ensures updates maintain category integrity
 */
const validateCategoryUpdate = (req, res, next) => {
    const { category } = req.body;

    if (category && !VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({
            success: false,
            message: `❌ Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`
        });
    }

    next();
};

module.exports = {
    validateProduct,
    checkValidationResult,
    handleUploadError,
    validateCategoryUpdate,
    VALID_CATEGORIES,
    SUBCATEGORIES,
    VALID_SIZES
};