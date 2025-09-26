# 🚀 Refactored API Routes Structure

## 📁 Directory Structure

```
routes/
├── index.js         # Central router that combines all routes
├── products.js      # Product CRUD operations
├── categories.js    # Category and subcategory endpoints
├── summary.js       # Summary and statistics endpoints
└── uploads.js       # File upload and product creation with images
```

## 🔧 Key Improvements Made

### ✅ **Issues Fixed:**

1. **Removed Duplicate Routes**: Eliminated duplicate `/categories-structure` endpoints
2. **Standardized Categories**: Unified category names across all files:
   - `sportwear`
   - `gym-fitness-wear` 
   - `safety-protective-wears`
   - `streetwear`
   - `fashion-wear`
   - `mma-arts-wears`
   - `accessories`

3. **Fixed Undefined Variables**: Replaced hardcoded `categories` array with dynamic `VALID_CATEGORIES` import
4. **Removed Hardcoded Routes**: Eliminated individual category routes in favor of dynamic `/products/category/:categoryName`
5. **Applied Validation Consistently**: Added `validateProduct` middleware to both creation endpoints
6. **Modular Structure**: Split monolithic 1000+ line file into focused, maintainable modules

### 🏗️ **New Architecture:**

## 📋 API Endpoints Reference

### **Products** (`/api/products/`)
- `GET /products-json` - All products in JSON format
- `GET /products/category/:categoryName` - Products by category
- `GET /products/category/:categoryName/manage` - Products for management dashboard
- `GET /products/subcategory/:categoryName/:subcategoryName` - Products by subcategory
- `GET /products/:category/:subcategory` - Alternative subcategory endpoint
- `PUT /products/category/:categoryName/:id` - Update product
- `DELETE /products/category/:categoryName/:id` - Delete product

### **Categories** (`/api/`)
- `GET /categories` - All categories with subcategories
- `GET /categories-structure` - Category structure only
- `GET /subcategories/:categoryName` - Subcategories for specific category

### **Summary** (`/api/`)
- `GET /categories/summary` - Categories with product counts

### **Uploads** (`/api/`)
- `POST /create-product` - Create product with image upload
- `POST /create-product-json` - Create product (JSON only, no images)

## 🎯 **Categories & Subcategories Structure**

```javascript
const SUBCATEGORIES = {
    'sportwear': [
        'American Football Uniform', 'Baseball Uniform', 'Basketball Uniform', 
        'Cheer Leading Uniform', 'Ice Hockey Uniform', 'Lacrosse Uniform', 
        'Rugby Uniforms', 'Volleyball Uniform', 'Netball Uniform', 'Cycling Uniform'
    ],
    'gym-fitness-wear': [
        'Leggings', 'Track Suits', 'Hoodies', 'Jogger Pants', 'Running Shorts',
        'Fitness Bra', 'Yoga Sets', 'Rash Guard', 'Body Suits', 'Women Crop Tops',
        'Tank Tops', 'Headwear and Accessories', 'Bags'
    ],
    'safety-protective-wears': [
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
    'mma-arts-wears': [
        'Wrestling Gear', 'Judo Uniforms', 'Karate Uniforms', 'Kickboxing Gear',
        'Brazilian Jiu-Jitsu (BJJ) Uniforms'
    ],
    'accessories': [
        'Bags', 'Caps', 'Socks'
    ]
};
```

## 🔗 **Frontend Integration**

Your frontend URLs remain the same. Examples for hosted version:

### **Category Endpoints:**
```javascript
// Get all categories
https://backend-ait6.onrender.com/api/categories

// Get products by category
https://backend-ait6.onrender.com/api/products/category/sportwear
https://backend-ait6.onrender.com/api/products/category/gym-fitness-wear

// Get subcategories
https://backend-ait6.onrender.com/api/subcategories/sportwear

// Get products by subcategory
https://backend-ait6.onrender.com/api/products/subcategory/sportwear/American%20Football%20Uniform
```

## 🚀 **Usage Examples**

### **JavaScript Fetch Examples:**

```javascript
// Get all categories
const categories = await fetch('https://backend-ait6.onrender.com/api/categories')
  .then(res => res.json());

// Get sportwear products
const sportwear = await fetch('https://backend-ait6.onrender.com/api/products/category/sportwear')
  .then(res => res.json());

// Get American Football Uniforms
const footballUniforms = await fetch('https://backend-ait6.onrender.com/api/products/subcategory/sportwear/American%20Football%20Uniform')
  .then(res => res.json());
```

## ✅ **Benefits of New Structure**

1. **🧩 Modular**: Each file has a single responsibility
2. **🔧 Maintainable**: Easy to find and update specific functionality
3. **🐛 Debuggable**: Isolated error handling per module
4. **📈 Scalable**: Easy to add new route categories
5. **🔄 Reusable**: Shared validation middleware across all routes
6. **🎯 Consistent**: Unified category naming and structure
7. **🚀 Performance**: No duplicate or conflicting routes

## 🛠️ **Maintenance Notes**

- **Adding New Categories**: Update `VALID_CATEGORIES` and `SUBCATEGORIES` in `middleware/validation.js`
- **Adding New Endpoints**: Create in appropriate route file and import in `routes/index.js`
- **Validation Changes**: Update `middleware/validation.js` and it applies everywhere
- **Error Handling**: Each route file has consistent error handling patterns

The refactored structure is now live and ready for production! 🎉