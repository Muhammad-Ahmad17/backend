#!/bin/bash

echo "🗑️ Database Truncation Script"
echo "============================="
echo "This will DELETE ALL PRODUCTS from the database!"
echo ""

# Get all products
echo "Getting all products..."
PRODUCTS=$(curl -s http://localhost:5000/api/products-json | jq -r '.products[] | "\(.category)|\(.id)"')

if [ -z "$PRODUCTS" ]; then
    echo "❌ No products found or server not responding"
    exit 1
fi

echo "Products to delete:"
echo "$PRODUCTS" | while IFS='|' read -r category id; do
    echo "  - $id (category: $category)"
done

echo ""
read -p "Are you sure you want to DELETE ALL products? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Truncation cancelled"
    exit 0
fi

echo ""
echo "🗑️ Starting deletion..."

# Delete each product
echo "$PRODUCTS" | while IFS='|' read -r category id; do
    echo "Deleting: $id from $category"
    
    RESULT=$(curl -s -X DELETE "http://localhost:5000/api/products/category/$category/$id")
    
    if [[ $RESULT == *"success\":true"* ]]; then
        echo "  ✅ Deleted: $id"
    else
        echo "  ❌ Failed to delete: $id"
        echo "     Response: $RESULT"
    fi
done

echo ""
echo "🔍 Checking remaining products..."
REMAINING=$(curl -s http://localhost:5000/api/products-json | jq -r '.count')

echo "Remaining products: $REMAINING"

if [ "$REMAINING" = "0" ]; then
    echo ""
    echo "✅ DATABASE TRUNCATED SUCCESSFULLY!"
    echo "All products have been removed from the database."
else
    echo ""
    echo "⚠️  Warning: $REMAINING products still remain in database"
fi