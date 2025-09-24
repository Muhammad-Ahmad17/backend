const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'Product ID is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [2, 'Product name must be at least 2 characters long'],
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: {
            values: ['sports-wear', 'gym-wear', 'fitness-wear', 'streetwear', 'fashion-wear', 'mma-arts', 'accessories'],
            message: 'Category must be one of: sports-wear, gym-wear, fitness-wear, streetwear, fashion-wear, mma-arts, accessories'
        }
    },
    subcategory: {
        type: String,
        required: [true, 'Subcategory is required'],
        trim: true,
        maxlength: [50, 'Subcategory cannot exceed 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    pictures: [{
        type: String,
        trim: true
    }],
    colours: [{
        type: String,
        trim: true,
        required: true
    }],
    printingMethod: {
        type: String,
        required: [true, 'Printing method is required'],
        trim: true
    },
    sizes: [{
        type: String,
        trim: true,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        required: true
    }],
    minimumQuantity: {
        type: Number,
        required: [true, 'Minimum quantity is required'],
        min: [1, 'Minimum quantity must be at least 1'],
        max: [1000, 'Minimum quantity cannot exceed 1000']
    },
    featured: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'out-of-stock', 'discontinued'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ featured: 1 });

module.exports = mongoose.model('Product', productSchema);