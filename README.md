# Store Backend API

A complete Node.js backend application with MongoDB connection and Cloudinary image hosting for product management.

## Features

- Express.js web server with MongoDB integration
- Product management with image upload to Cloudinary
- Frontend forms for adding and viewing products
- RESTful API endpoints for products CRUD operations
- File upload with validation and optimization
- Responsive web interface
- Search and filtering capabilities
- Pagination support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Cloudinary account for image hosting
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/store_backend
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret_key_here
API_VERSION=v1
```

3. Make sure MongoDB is running (if using local installation)

4. Set up your Cloudinary account:
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Get your cloud name, API key, and API secret from the dashboard
   - Update the `.env` file with your credentials

## Usage

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## Frontend Interface

- **Add Products**: `http://localhost:5000/` - Form to add new products
- **View Products**: `http://localhost:5000/products.html` - Browse existing products

## API Endpoints

### Base URL: `http://localhost:5000/api`

#### Products
- `GET /products` - Get all products (with pagination and filters)
- `POST /products` - Create new product (with image upload)
- `GET /products/:id` - Get single product by ID
- `PUT /products/:id` - Update product (with image upload)
- `DELETE /products/:id` - Delete product

#### Metadata
- `GET /products/meta/categories` - Get all categories
- `GET /products/meta/subcategories/:category` - Get subcategories by category

#### Query Parameters for GET /products:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category
- `subcategory` - Filter by subcategory
- `featured` - Filter by featured status (true/false)
- `search` - Search in name, description, and tags

## Product Data Structure

Products are stored with the following structure:
```json
{
  "id": "ps-61",
  "name": "Custom Embroidered Cap",
  "category": "accessories",
  "subcategory": "caps",
  "description": "Premium baseball cap with custom embroidery options...",
  "pictures": [
    "https://res.cloudinary.com/your-cloud/image/upload/..."
  ],
  "colours": ["Black", "Navy", "Red"],
  "printingMethod": "Embroidery, Heat Transfer, Patches",
  "sizes": ["One Size"],
  "minimumQuantity": 24,
  "featured": true,
  "tags": ["cap", "embroidery", "custom"]
}
```

## File Upload

- **Supported formats**: JPG, JPEG, PNG, WebP
- **Maximum file size**: 5MB per image
- **Maximum files**: 5 images per product
- **Auto-optimization**: Images are resized to 800x600 with quality optimization
- **Storage**: All images are hosted on Cloudinary

## Project Structure

```
backend/
├── config/
│   ├── database.js         # MongoDB connection
│   └── cloudinary.js       # Cloudinary configuration
├── middleware/
│   └── validation.js       # Input validation middleware
├── models/
│   └── Product.js          # Product schema
├── routes/
│   ├── api.js              # Main API routes
│   └── products.js         # Product-specific routes
├── public/
│   ├── index.html          # Add product form
│   └── products.html       # View products page
├── .env                    # Environment variables
├── .gitignore             # Git ignore rules
├── index.js               # Main server file
├── package.json           # Dependencies and scripts
└── README.md              # Documentation
```

## Development

### Adding New Features

1. **Models**: Add new schemas in `models/` directory
2. **Routes**: Create route files in `routes/` directory
3. **Middleware**: Add custom middleware in `middleware/` directory
4. **Frontend**: Add new pages in `public/` directory

### Testing the API

You can test the API using tools like Postman or curl:

```bash
# Get all products
curl http://localhost:5000/api/products

# Create a product (with form data)
curl -X POST http://localhost:5000/api/products \
  -F "name=Test Product" \
  -F "category=accessories" \
  -F "subcategory=caps" \
  -F "description=Test description" \
  -F "colours=Black,White" \
  -F "sizes=M,L" \
  -F "printingMethod=Screen Print" \
  -F "minimumQuantity=10" \
  -F "pictures=@image1.jpg"
```

## Next Steps

Potential enhancements:
- User authentication and authorization
- Admin dashboard
- Order management system
- Inventory tracking
- Email notifications
- Payment integration
- API rate limiting
- Advanced search with Elasticsearch
- Product reviews and ratings