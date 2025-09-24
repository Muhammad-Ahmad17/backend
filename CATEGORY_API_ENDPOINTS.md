# Category-Specific API Endpoints

This document describes all the category-specific API endpoints for the product management system.

## Base URL
```
http://localhost:5000/api
```

## Category-Specific Endpoints

### 1. Sports Wear
```http
GET /api/products/category/sports-wear
```

### 2. Gym Wear
```http
GET /api/products/category/gym-wear
```

### 3. Fitness Wear
```http
GET /api/products/category/fitness-wear
```

### 4. Streetwear
```http
GET /api/products/category/streetwear
```

### 5. Fashion Wear
```http
GET /api/products/category/fashion-wear
```

### 6. MMA Arts
```http
GET /api/products/category/mma-arts
```

### 7. Accessories
```http
GET /api/products/category/accessories
```

## Dynamic Category Endpoint
```http
GET /api/products/category/:categoryName
```

This endpoint accepts any valid category name as a parameter.

**Valid categories:**
- `sports-wear`
- `gym-wear`
- `fitness-wear`
- `streetwear`
- `fashion-wear`
- `mma-arts`
- `accessories`

## Categories Summary
```http
GET /api/categories/summary
```

Returns a summary of all categories with product counts and endpoints.

## Response Format

### Success Response
```json
{
  "success": true,
  "category": "sports-wear",
  "categoryDisplay": "Sports Wear",
  "count": 3,
  "products": [
    {
      "id": "ps-1",
      "name": "Pro Athletic Football Jersey",
      "category": "sports-wear",
      "subcategory": "football",
      "description": "High-performance football jersey with moisture-wicking technology...",
      "pictures": [
        "/assets/images/products/sports-wear/football-jersey-1.jpg"
      ],
      "colours": ["Red", "Blue", "Green"],
      "printingMethod": "Sublimation, Screen Print, Heat Transfer, Embroidery",
      "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
      "minimumQuantity": 10,
      "featured": true,
      "tags": ["football", "jersey", "sports", "athletic", "professional"]
    }
  ]
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid category. Available categories: sports-wear, gym-wear, fitness-wear, streetwear, fashion-wear, mma-arts, accessories"
}
```

## Categories Summary Response
```json
{
  "success": true,
  "message": "Categories summary fetched successfully",
  "totalCategories": 7,
  "categories": [
    {
      "category": "sports-wear",
      "name": "Sports Wear",
      "count": 3,
      "endpoint": "/api/products/category/sports-wear"
    },
    {
      "category": "gym-wear",
      "name": "Gym Wear",
      "count": 0,
      "endpoint": "/api/products/category/gym-wear"
    }
  ]
}
```

## Usage Examples

### Frontend Integration (JavaScript)
```javascript
// Fetch sports wear products
const fetchSportsWearProducts = async () => {
  try {
    const response = await fetch('/api/products/category/sports-wear');
    const data = await response.json();
    
    if (data.success) {
      console.log(`Found ${data.count} sports wear products:`, data.products);
      return data.products;
    }
  } catch (error) {
    console.error('Error fetching sports wear products:', error);
  }
};

// Fetch all categories summary
const fetchCategoriesSummary = async () => {
  try {
    const response = await fetch('/api/categories/summary');
    const data = await response.json();
    
    if (data.success) {
      console.log('Categories:', data.categories);
      return data.categories;
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

// Dynamic category fetching
const fetchProductsByCategory = async (categoryName) => {
  try {
    const response = await fetch(`/api/products/category/${categoryName}`);
    const data = await response.json();
    
    if (data.success) {
      return data.products;
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
```

### React Component Example
```jsx
import React, { useState, useEffect } from 'react';

const CategoryProducts = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products/category/${category}`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{category.replace('-', ' ').toUpperCase()} Products</h2>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
};
```

## Notes

1. All endpoints return products sorted by creation date (newest first)
2. The product structure matches your JSON format exactly
3. Error handling is included for invalid categories
4. Products include all fields: id, name, category, subcategory, description, pictures, colours, printingMethod, sizes, minimumQuantity, featured, tags
5. CORS is enabled for frontend consumption
6. All responses are in JSON format