# Backend API Server

A basic Node.js backend application with MongoDB connection using Express and Mongoose.

## Features

- Express.js web server
- MongoDB connection with Mongoose ODM
- Environment variable configuration
- CORS enabled
- Basic API routes
- Error handling middleware
- Development and production ready

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` file and update the MongoDB connection string
   - For local MongoDB: `mongodb://localhost:27017/store_backend`
   - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database_name`

3. Make sure MongoDB is running (if using local installation)

## Usage

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

### Base URL: `http://localhost:5000`

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint
- `GET /api/test` - Test endpoint
- `GET /api/data` - Sample data endpoint
- `POST /api/echo` - Echo endpoint for testing POST requests

## Project Structure

```
backend/
├── config/
│   └── database.js     # MongoDB connection configuration
├── routes/
│   └── api.js          # API routes
├── .env                # Environment variables
├── .gitignore          # Git ignore rules
├── index.js            # Main server file
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/store_backend
JWT_SECRET=your_jwt_secret_key_here
API_VERSION=v1
```

## Next Steps

You can expand this basic setup by adding:

- User authentication and authorization
- Data models and schemas
- More API endpoints
- Input validation
- Logging system
- Testing framework
- API documentation (Swagger)
- Rate limiting
- Security middleware