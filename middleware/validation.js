const { body, validationResult } = require('express-validator');

/**
 * Frontend-focused Product Validation Middleware
 * Validates all product fields that affect frontend display and functionality
 * Optimized for category-based product management system
 */

// Available product categories for validation
const VALID_CATEGORIES = [
    'sports-wear', 'gym-wear', 'safety-wear',
    'streetwear', 'fashion-wear', 'mma-arts', 'accessories'
];

const SUBCATEGORIES = {
    'sports-wear': [
        'American Football Uniform', 'Baseball Uniform', 'Basketball Uniform', 'Cheer Leading Uniform',
        'Ice Hockey Uniform', 'Lacrosse Uniform', 'Rugby Uniforms', 'Volleyball Uniform',
        'Netball Uniform', 'Cycling Uniform', 'T-Shirts', 'Tank Tops'
    ],
    'gym-wear': [
        'Leggings', 'Track Suits', 'Hoodies', 'Jogger Pants', 'Running Shorts',
        'Fitness Bra', 'Yoga Sets', 'Rash Guard', 'Body Suits', 'Women Crop Tops',
        'Tank Tops', 'Headwear and Accessories', 'Bags', 'tank-top'
    ],
    'safety-wear': [
        'Safety Jackets', 'Safety Trousers', 'Safety Shirts', 'High-Visibility Clothing',
        'Anti-Static Clothing', 'Flame-Retardant Clothing'
    ],
    'streetwear': [
        'Onesies', 'Casual Shorts', 'Beach Shorts', 'Zipper Hoodies', 'Tie-Dye Hoodies',
        'Sweatshirts', 'Flannel Shirts', 'Sweatpants & Bottoms', 'T-Shirts', 'Polo Shirts',
        'Singlets & Tops'
    ],
    'fashion-wear': [
        'Pull Over Jackets', 'Varsity Jackets', 'Puffers Jackets', 'Bomber Jackets',
        'Soft Shell Jackets', 'Rain Jackets', 'Leather Jackets', 'Denim Jackets',
        'Coach Jackets', 'Windbreaker Jackets'
    ],
    'mma-arts': [
        'Wrestling Gear', 'Judo Uniforms', 'Karate Uniforms', 'Kickboxing Gear',
        'Brazilian Jiu-Jitsu (BJJ) Uniforms', 'T-Shirts'
    ],
    'accessories': [
        'Bags', 'Caps', 'Socks'
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

    // Colors validation - user-defined colors array or single color
    body('colours')
        .custom((value) => {
            if (Array.isArray(value)) {
                return value.length >= 1 && value.every(color => typeof color === 'string' && color.trim().length > 0);
            }
            if (typeof value === 'string' && value.trim().length > 0) {
                return true; // Single color is valid
            }
            throw new Error('At least one colour must be provided');
        })
        .withMessage('At least one colour must be provided'),

    // Printing method validation - manufacturing specification
    body('printingMethod')
        .trim()
        .isLength({ min: 2, max: 200 })
        .withMessage('Printing method must be between 2 and 200 characters'),

    // Sizes validation - multiple selection allowed, handle both arrays and single values
    body('sizes')
        .custom((value) => {
            const VALID_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
            if (Array.isArray(value)) {
                return value.length >= 1 && value.every(size => VALID_SIZES.includes(size));
            }
            if (typeof value === 'string' && VALID_SIZES.includes(value)) {
                return true; // Single size is valid
            }
            throw new Error(`At least one size must be provided. Valid sizes: ${VALID_SIZES.join(', ')}`);
        })
        .withMessage('At least one size must be provided'),

    // Minimum quantity validation - business rule (handle string input from forms)
    body('minimumQuantity')
        .custom((value) => {
            const num = parseInt(value);
            if (isNaN(num) || num < 1 || num > 1000) {
                throw new Error('Minimum quantity must be between 1 and 1000');
            }
            return true;
        })
        .withMessage('Minimum quantity must be between 1 and 1000'),

    // Featured status validation - optional boolean
    body('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean value'),

    // Tags validation - optional array or comma-separated string for SEO and filtering
    body('tags')
        .optional()
        .custom((value) => {
            if (Array.isArray(value)) {
                return value.every(tag => typeof tag === 'string' && tag.trim().length > 0);
            }
            if (typeof value === 'string') {
                // Accept comma-separated string
                return value.split(',').every(tag => tag.trim().length > 0);
            }
            throw new Error('Tags must be an array or a comma-separated string');
        })
        .withMessage('Tags must be an array or a comma-separated string'),
];

/**
 * Middleware to process validation results
 * Returns user-friendly error messages for frontend display
 */
const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('❌ VALIDATION ERRORS DETECTED:');
        console.log('===============================');
        errors.array().forEach((error, index) => {
            console.log(`${index + 1}. Field: "${error.path}"`);
            console.log(`   Value: ${JSON.stringify(error.value)}`);
            console.log(`   Error: ${error.msg}`);
            console.log(`   Location: ${error.location}`);
        });
        console.log('===============================');

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
    console.log('✅ Validation passed successfully!');
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