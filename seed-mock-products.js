/**
 * Mock Product Seeder
 * Creates sample products across all categories and subcategories for frontend testing
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Product Model
const Product = require('./models/Product');

// Mock product data for all categories
const mockProducts = [
    // ============================================
    // SPORTS-WEAR CATEGORY (12 subcategories)
    // ============================================
    {
        id: 'sports-001',
        name: 'Pro American Football Jersey',
        category: 'sports-wear',
        subcategory: 'American Football Uniform',
        description: 'Premium American football jersey with moisture-wicking fabric and reinforced stitching for professional performance.',
        colours: ['Navy Blue', 'Red', 'White'],
        printingMethod: 'Sublimation',
        sizes: ['M', 'L', 'XL', 'XXL'],
        minimumQuantity: 25,
        featured: true,
        tags: ['football', 'sports', 'team uniform', 'professional'],
        status: 'active'
    },
    {
        id: 'sports-002',
        name: 'Classic Baseball Uniform Set',
        category: 'sports-wear',
        subcategory: 'Baseball Uniform',
        description: 'Complete baseball uniform set including jersey and pants. Breathable fabric perfect for long games.',
        colours: ['White', 'Grey', 'Pinstripe'],
        printingMethod: 'Screen Print',
        sizes: ['S', 'M', 'L', 'XL'],
        minimumQuantity: 30,
        featured: true,
        tags: ['baseball', 'uniform', 'sports', 'team'],
        status: 'active'
    },
    {
        id: 'sports-003',
        name: 'Elite Basketball Jersey',
        category: 'sports-wear',
        subcategory: 'Basketball Uniform',
        description: 'Lightweight basketball jersey with excellent breathability and freedom of movement for peak performance.',
        colours: ['Black', 'Orange', 'Purple'],
        printingMethod: 'Sublimation',
        sizes: ['M', 'L', 'XL', 'XXL', 'XXXL'],
        minimumQuantity: 20,
        featured: false,
        tags: ['basketball', 'jersey', 'performance', 'sports'],
        status: 'active'
    },
    {
        id: 'sports-004',
        name: 'Cheerleading Competition Outfit',
        category: 'sports-wear',
        subcategory: 'Cheer Leading Uniform',
        description: 'Vibrant cheerleading uniform designed for competitions with sparkle detailing and comfortable fit.',
        colours: ['Red', 'Gold', 'Silver'],
        printingMethod: 'Heat Transfer',
        sizes: ['XS', 'S', 'M', 'L'],
        minimumQuantity: 15,
        featured: false,
        tags: ['cheerleading', 'competition', 'performance', 'sparkle'],
        status: 'active'
    },
    {
        id: 'sports-005',
        name: 'Pro Ice Hockey Jersey',
        category: 'sports-wear',
        subcategory: 'Ice Hockey Uniform',
        description: 'Durable ice hockey jersey with reinforced shoulders and moisture management technology.',
        colours: ['Black', 'White', 'Blue'],
        printingMethod: 'Sublimation',
        sizes: ['M', 'L', 'XL', 'XXL'],
        minimumQuantity: 25,
        featured: false,
        tags: ['hockey', 'ice hockey', 'winter sports', 'professional'],
        status: 'active'
    },
    {
        id: 'sports-006',
        name: 'Performance Cycling Jersey',
        category: 'sports-wear',
        subcategory: 'Cycling Uniform',
        description: 'Aerodynamic cycling jersey with rear pockets and reflective elements for safety and performance.',
        colours: ['Neon Yellow', 'Black', 'Red'],
        printingMethod: 'Sublimation',
        sizes: ['S', 'M', 'L', 'XL'],
        minimumQuantity: 20,
        featured: true,
        tags: ['cycling', 'performance', 'aerodynamic', 'reflective'],
        status: 'active'
    },

    // ============================================
    // GYM-WEAR CATEGORY (14 subcategories)
    // ============================================
    {
        id: 'gym-001',
        name: 'High-Waist Compression Leggings',
        category: 'gym-wear',
        subcategory: 'Leggings',
        description: 'Squat-proof compression leggings with high waist support and moisture-wicking fabric for intense workouts.',
        colours: ['Black', 'Navy', 'Purple'],
        printingMethod: 'Sublimation',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        minimumQuantity: 50,
        featured: true,
        tags: ['leggings', 'compression', 'workout', 'yoga'],
        status: 'active'
    },
    {
        id: 'gym-002',
        name: 'Premium Track Suit Set',
        category: 'gym-wear',
        subcategory: 'Track Suits',
        description: 'Complete track suit with jacket and pants. Perfect for warm-ups, cool-downs, and casual wear.',
        colours: ['Black', 'Grey', 'Navy Blue'],
        printingMethod: 'Embroidery',
        sizes: ['M', 'L', 'XL', 'XXL'],
        minimumQuantity: 30,
        featured: true,
        tags: ['tracksuit', 'training', 'casual', 'sports'],
        status: 'active'
    },
    {
        id: 'gym-003',
        name: 'Performance Hoodie',
        category: 'gym-wear',
        subcategory: 'Hoodies',
        description: 'Lightweight performance hoodie with moisture-wicking technology and kangaroo pocket.',
        colours: ['Charcoal', 'Maroon', 'Forest Green'],
        printingMethod: 'Screen Print',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        minimumQuantity: 40,
        featured: false,
        tags: ['hoodie', 'workout', 'training', 'casual'],
        status: 'active'
    },
    {
        id: 'gym-004',
        name: 'Athletic Jogger Pants',
        category: 'gym-wear',
        subcategory: 'Jogger Pants',
        description: 'Tapered jogger pants with elastic cuffs and zippered pockets for secure storage.',
        colours: ['Black', 'Grey', 'Navy'],
        printingMethod: 'Heat Transfer',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        minimumQuantity: 35,
        featured: false,
        tags: ['joggers', 'pants', 'casual', 'athletic'],
        status: 'active'
    },
    {
        id: 'gym-005',
        name: 'High-Impact Sports Bra',
        category: 'gym-wear',
        subcategory: 'Fitness Bra',
        description: 'Maximum support sports bra designed for high-impact activities with removable padding.',
        colours: ['Black', 'Pink', 'Blue'],
        printingMethod: 'Digital Print',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        minimumQuantity: 60,
        featured: true,
        tags: ['sports bra', 'fitness', 'support', 'women'],
        status: 'active'
    },
    {
        id: 'gym-006',
        name: 'Women Crop Top Active',
        category: 'gym-wear',
        subcategory: 'Women Crop Tops',
        description: 'Stylish and functional crop top for workouts with breathable mesh panels.',
        colours: ['White', 'Coral', 'Mint Green'],
        printingMethod: 'Sublimation',
        sizes: ['XS', 'S', 'M', 'L'],
        minimumQuantity: 45,
        featured: false,
        tags: ['crop top', 'women', 'fitness', 'active'],
        status: 'active'
    },

    // ============================================
    // SAFETY-WEAR CATEGORY (6 subcategories)
    // ============================================
    {
        id: 'safety-001',
        name: 'High Visibility Safety Jacket',
        category: 'safety-wear',
        subcategory: 'Safety Jackets',
        description: 'High visibility jacket with reflective strips meeting EN ISO 20471 standards for maximum safety.',
        colours: ['Orange', 'Yellow', 'Lime Green'],
        printingMethod: 'Reflective Print',
        sizes: ['M', 'L', 'XL', 'XXL', 'XXXL'],
        minimumQuantity: 50,
        featured: true,
        tags: ['safety', 'visibility', 'construction', 'reflective'],
        status: 'active'
    },
    {
        id: 'safety-002',
        name: 'Industrial Safety Trousers',
        category: 'safety-wear',
        subcategory: 'Safety Trousers',
        description: 'Durable safety trousers with reinforced knees and multiple pockets for tools and equipment.',
        colours: ['Navy Blue', 'Black', 'Orange'],
        printingMethod: 'Embroidery',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        minimumQuantity: 40,
        featured: true,
        tags: ['safety', 'industrial', 'work wear', 'durable'],
        status: 'active'
    },
    {
        id: 'safety-003',
        name: 'Hi-Vis Work Shirt',
        category: 'safety-wear',
        subcategory: 'Safety Shirts',
        description: 'Breathable high visibility work shirt with reflective tape for all-day comfort and safety.',
        colours: ['Yellow', 'Orange'],
        printingMethod: 'Reflective Strip',
        sizes: ['M', 'L', 'XL', 'XXL'],
        minimumQuantity: 30,
        featured: false,
        tags: ['safety', 'shirt', 'visibility', 'work'],
        status: 'active'
    },
    {
        id: 'safety-004',
        name: 'Reflective Safety Vest',
        category: 'safety-wear',
        subcategory: 'High-Visibility Clothing',
        description: 'Lightweight reflective safety vest for maximum visibility in low-light conditions.',
        colours: ['Fluorescent Yellow', 'Fluorescent Orange'],
        printingMethod: 'Reflective Print',
        sizes: ['S', 'M', 'L', 'XL'],
        minimumQuantity: 100,
        featured: true,
        tags: ['safety vest', 'reflective', 'visibility', 'construction'],
        status: 'active'
    },
    {
        id: 'safety-005',
        name: 'Anti-Static Work Coverall',
        category: 'safety-wear',
        subcategory: 'Anti-Static Clothing',
        description: 'Anti-static coverall for electronics and chemical industry with conductive threading.',
        colours: ['Dark Blue', 'Grey'],
        printingMethod: 'Logo Embroidery',
        sizes: ['M', 'L', 'XL', 'XXL'],
        minimumQuantity: 25,
        featured: false,
        tags: ['anti-static', 'coverall', 'industrial', 'safety'],
        status: 'active'
    },
    {
        id: 'safety-006',
        name: 'Flame Retardant Coverall',
        category: 'safety-wear',
        subcategory: 'Flame-Retardant Clothing',
        description: 'Fire-resistant coverall meeting EN ISO 11612 standards for welding and hot work environments.',
        colours: ['Dark Blue', 'Red'],
        printingMethod: 'Heat Transfer',
        sizes: ['M', 'L', 'XL', 'XXL', 'XXXL'],
        minimumQuantity: 20,
        featured: true,
        tags: ['flame-retardant', 'fire-resistant', 'welding', 'safety'],
        status: 'active'
    },

    // ============================================
    // STREETWEAR CATEGORY (11 subcategories)
    // ============================================
    {
        id: 'street-001',
        name: 'Comfort Fleece Onesie',
        category: 'streetwear',
        subcategory: 'Onesies',
        description: 'Ultra-comfortable fleece onesie perfect for lounging and casual wear.',
        colours: ['Grey', 'Black', 'Navy'],
        printingMethod: 'Screen Print',
        sizes: ['M', 'L', 'XL', 'XXL'],
        minimumQuantity: 30,
        featured: false,
        tags: ['onesie', 'comfort', 'loungewear', 'casual'],
        status: 'active'
    },
    {
        id: 'street-002',
        name: 'Premium Zip-Up Hoodie',
        category: 'streetwear',
        subcategory: 'Zipper Hoodies',
        description: 'Heavy-weight zip-up hoodie with brushed fleece interior for maximum warmth.',
        colours: ['Black', 'Charcoal', 'Burgundy'],
        printingMethod: 'Embroidery',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        minimumQuantity: 50,
        featured: true,
        tags: ['hoodie', 'streetwear', 'zipper', 'casual'],
        status: 'active'
    },
    {
        id: 'street-003',
        name: 'Tie-Dye Pullover Hoodie',
        category: 'streetwear',
        subcategory: 'Tie-Dye Hoodies',
        description: 'Unique tie-dye hoodie with each piece having a one-of-a-kind pattern.',
        colours: ['Rainbow', 'Blue-Purple', 'Pink-Orange'],
        printingMethod: 'Tie-Dye',
        sizes: ['S', 'M', 'L', 'XL'],
        minimumQuantity: 25,
        featured: true,
        tags: ['tie-dye', 'hoodie', 'unique', 'streetwear'],
        status: 'active'
    },
    {
        id: 'street-004',
        name: 'Classic Crewneck Sweatshirt',
        category: 'streetwear',
        subcategory: 'Sweatshirts',
        description: 'Timeless crewneck sweatshirt with ribbed cuffs and waistband for perfect fit.',
        colours: ['Black', 'White', 'Grey', 'Navy'],
        printingMethod: 'Screen Print',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        minimumQuantity: 60,
        featured: false,
        tags: ['sweatshirt', 'classic', 'casual', 'comfort'],
        status: 'active'
    },
    {
        id: 'street-005',
        name: 'Vintage Flannel Shirt',
        category: 'streetwear',
        subcategory: 'Flannel Shirts',
        description: 'Soft cotton flannel shirt with classic plaid pattern perfect for layering.',
        colours: ['Red-Black Check', 'Blue-Black Check', 'Green-Black Check'],
        printingMethod: 'Woven Pattern',
        sizes: ['M', 'L', 'XL', 'XXL'],
        minimumQuantity: 35,
        featured: false,
        tags: ['flannel', 'plaid', 'vintage', 'casual'],
        status: 'active'
    },
    {
        id: 'street-006',
        name: 'Urban Streetwear T-Shirt',
        category: 'streetwear',
        subcategory: 'T-Shirts',
        description: 'Premium cotton t-shirt with modern graphic design for urban style.',
        colours: ['Black', 'White', 'Olive Green'],
        printingMethod: 'DTG (Direct to Garment)',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        minimumQuantity: 100,
        featured: true,
        tags: ['t-shirt', 'streetwear', 'urban', 'graphic'],
        status: 'active'
    },

    // ============================================
    // FASHION-WEAR CATEGORY (10 subcategories)
    // ============================================
    {
        id: 'fashion-001',
        name: 'Classic Varsity Jacket',
        category: 'fashion-wear',
        subcategory: 'Varsity Jackets',
        description: 'Authentic varsity jacket with leather sleeves and wool body, perfect for a retro look.',
        colours: ['Black-White', 'Navy-Grey', 'Burgundy-Cream'],
        printingMethod: 'Embroidery',
        sizes: ['M', 'L', 'XL', 'XXL'],
        minimumQuantity: 20,
        featured: true,
        tags: ['varsity', 'jacket', 'retro', 'fashion'],
        status: 'active'
    },
    {
        id: 'fashion-002',
        name: 'Premium Puffer Jacket',
        category: 'fashion-wear',
        subcategory: 'Puffers Jackets',
        description: 'Insulated puffer jacket with water-resistant exterior for cold weather protection.',
        colours: ['Black', 'Navy', 'Olive Green'],
        printingMethod: 'Heat Transfer',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        minimumQuantity: 25,
        featured: true,
        tags: ['puffer', 'winter', 'insulated', 'warm'],
        status: 'active'
    },
    {
        id: 'fashion-003',
        name: 'Retro Bomber Jacket',
        category: 'fashion-wear',
        subcategory: 'Bomber Jackets',
        description: 'Classic bomber jacket with ribbed collar and cuffs, lightweight and stylish.',
        colours: ['Black', 'Khaki', 'Burgundy'],
        printingMethod: 'Embroidery',
        sizes: ['M', 'L', 'XL', 'XXL'],
        minimumQuantity: 30,
        featured: false,
        tags: ['bomber', 'retro', 'jacket', 'style'],
        status: 'active'
    },
    {
        id: 'fashion-004',
        name: 'Waterproof Rain Jacket',
        category: 'fashion-wear',
        subcategory: 'Rain Jackets',
        description: 'Fully waterproof rain jacket with sealed seams and adjustable hood.',
        colours: ['Yellow', 'Navy', 'Black'],
        printingMethod: 'Screen Print',
        sizes: ['S', 'M', 'L', 'XL'],
        minimumQuantity: 40,
        featured: false,
        tags: ['rain jacket', 'waterproof', 'outdoor', 'weather'],
        status: 'active'
    },
    {
        id: 'fashion-005',
        name: 'Genuine Leather Jacket',
        category: 'fashion-wear',
        subcategory: 'Leather Jackets',
        description: 'Premium genuine leather jacket with asymmetric zipper and multiple pockets.',
        colours: ['Black', 'Brown', 'Dark Brown'],
        printingMethod: 'Leather Embossing',
        sizes: ['M', 'L', 'XL', 'XXL'],
        minimumQuantity: 15,
        featured: true,
        tags: ['leather', 'premium', 'jacket', 'luxury'],
        status: 'active'
    },
    {
        id: 'fashion-006',
        name: 'Lightweight Windbreaker',
        category: 'fashion-wear',
        subcategory: 'Windbreaker Jackets',
        description: 'Packable windbreaker jacket perfect for outdoor activities and travel.',
        colours: ['Neon Pink', 'Electric Blue', 'Lime Green'],
        printingMethod: 'Screen Print',
        sizes: ['S', 'M', 'L', 'XL'],
        minimumQuantity: 50,
        featured: false,
        tags: ['windbreaker', 'lightweight', 'outdoor', 'travel'],
        status: 'active'
    },

    // ============================================
    // MMA-ARTS CATEGORY (6 subcategories)
    // ============================================
    {
        id: 'mma-001',
        name: 'Pro Wrestling Singlet',
        category: 'mma-arts',
        subcategory: 'Wrestling Gear',
        description: 'Competition-grade wrestling singlet with moisture-wicking fabric and reinforced stitching.',
        colours: ['Red', 'Blue', 'Black'],
        printingMethod: 'Sublimation',
        sizes: ['S', 'M', 'L', 'XL'],
        minimumQuantity: 25,
        featured: true,
        tags: ['wrestling', 'singlet', 'competition', 'mma'],
        status: 'active'
    },
    {
        id: 'mma-002',
        name: 'Traditional Judo Gi',
        category: 'mma-arts',
        subcategory: 'Judo Uniforms',
        description: 'Traditional judo gi made from durable cotton for training and competition.',
        colours: ['White', 'Blue'],
        printingMethod: 'Embroidery',
        sizes: ['M', 'L', 'XL', 'XXL'],
        minimumQuantity: 20,
        featured: true,
        tags: ['judo', 'gi', 'martial arts', 'traditional'],
        status: 'active'
    },
    {
        id: 'mma-003',
        name: 'Karate Uniform Set',
        category: 'mma-arts',
        subcategory: 'Karate Uniforms',
        description: 'Complete karate uniform with jacket, pants, and belt. Lightweight and breathable.',
        colours: ['White'],
        printingMethod: 'Embroidery',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        minimumQuantity: 30,
        featured: false,
        tags: ['karate', 'uniform', 'martial arts', 'gi'],
        status: 'active'
    },
    {
        id: 'mma-004',
        name: 'Kickboxing Shorts',
        category: 'mma-arts',
        subcategory: 'Kickboxing Gear',
        description: 'Professional kickboxing shorts with high split for maximum leg mobility.',
        colours: ['Black', 'Red', 'Blue', 'Gold'],
        printingMethod: 'Sublimation',
        sizes: ['S', 'M', 'L', 'XL'],
        minimumQuantity: 40,
        featured: true,
        tags: ['kickboxing', 'shorts', 'mma', 'training'],
        status: 'active'
    },
    {
        id: 'mma-005',
        name: 'BJJ Gi - Brazilian Jiu-Jitsu',
        category: 'mma-arts',
        subcategory: 'Brazilian Jiu-Jitsu (BJJ) Uniforms',
        description: 'Premium BJJ gi with reinforced collar and knee padding for intense training.',
        colours: ['White', 'Blue', 'Black'],
        printingMethod: 'Embroidery',
        sizes: ['S', 'M', 'L', 'XL'],
        minimumQuantity: 20,
        featured: true,
        tags: ['bjj', 'brazilian jiu-jitsu', 'gi', 'martial arts'],
        status: 'active'
    },
    {
        id: 'mma-006',
        name: 'MMA Training T-Shirt',
        category: 'mma-arts',
        subcategory: 'T-Shirts',
        description: 'Performance t-shirt designed for MMA training with moisture-wicking technology.',
        colours: ['Black', 'Grey', 'White'],
        printingMethod: 'Screen Print',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        minimumQuantity: 60,
        featured: false,
        tags: ['mma', 't-shirt', 'training', 'performance'],
        status: 'active'
    },

    // ============================================
    // ACCESSORIES CATEGORY (3 subcategories)
    // ============================================
    {
        id: 'acc-001',
        name: 'Sports Duffel Bag',
        category: 'accessories',
        subcategory: 'Bags',
        description: 'Large capacity sports duffel bag with multiple compartments and adjustable shoulder strap.',
        colours: ['Black', 'Navy', 'Grey'],
        printingMethod: 'Embroidery',
        sizes: ['M', 'L'],
        minimumQuantity: 30,
        featured: true,
        tags: ['bag', 'duffel', 'sports', 'gym'],
        status: 'active'
    },
    {
        id: 'acc-002',
        name: 'Performance Baseball Cap',
        category: 'accessories',
        subcategory: 'Caps',
        description: 'Breathable baseball cap with moisture-wicking sweatband and adjustable back closure.',
        colours: ['Black', 'Navy', 'White', 'Red'],
        printingMethod: 'Embroidery',
        sizes: ['M', 'L'],
        minimumQuantity: 100,
        featured: true,
        tags: ['cap', 'baseball cap', 'hat', 'sports'],
        status: 'active'
    },
    {
        id: 'acc-003',
        name: 'Athletic Performance Socks',
        category: 'accessories',
        subcategory: 'Socks',
        description: 'Cushioned athletic socks with arch support and moisture-wicking fabric.',
        colours: ['White', 'Black', 'Grey'],
        printingMethod: 'Woven Logo',
        sizes: ['S', 'M', 'L'],
        minimumQuantity: 200,
        featured: false,
        tags: ['socks', 'athletic', 'sports', 'comfort'],
        status: 'active'
    }
];

// Seed function
const seedProducts = async () => {
    try {
        console.log('🌱 Starting mock product seeding...');
        console.log('═══════════════════════════════════════════════\n');

        // Clear existing products (optional - comment out to keep existing products)
        console.log('🗑️  Clearing existing mock products...');
        await Product.deleteMany({ id: { $regex: /^(sports|gym|safety|street|fashion|mma|acc)-\d{3}$/ } });
        console.log('✅ Existing mock products cleared\n');

        // Insert mock products
        console.log('📦 Inserting mock products...\n');

        let successCount = 0;
        let errorCount = 0;
        const categoryCount = {};

        for (const product of mockProducts) {
            try {
                await Product.create(product);
                successCount++;

                // Count by category
                if (!categoryCount[product.category]) {
                    categoryCount[product.category] = 0;
                }
                categoryCount[product.category]++;

                console.log(`✅ Created: ${product.name} (${product.category} - ${product.subcategory})`);
            } catch (error) {
                errorCount++;
                console.error(`❌ Failed to create ${product.name}: ${error.message}`);
            }
        }

        console.log('\n═══════════════════════════════════════════════');
        console.log('📊 SEEDING SUMMARY');
        console.log('═══════════════════════════════════════════════');
        console.log(`✅ Successfully created: ${successCount} products`);
        console.log(`❌ Failed: ${errorCount} products`);
        console.log('\n📋 Products by Category:');

        Object.entries(categoryCount).sort().forEach(([category, count]) => {
            const categoryDisplay = category.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            console.log(`   • ${categoryDisplay}: ${count} products`);
        });

        console.log('\n═══════════════════════════════════════════════');
        console.log('🎉 Mock product seeding completed!');
        console.log('═══════════════════════════════════════════════\n');

        console.log('🌐 Access your products at:');
        console.log('   Dashboard: http://localhost:5000/dashboard');
        console.log('   API: http://localhost:5000/api/products-json');
        console.log('   By Category: http://localhost:5000/api/products/category/{category-name}\n');

    } catch (error) {
        console.error('💥 Error during seeding:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
    }
};

// Run seeder
connectDB().then(() => {
    seedProducts();
});
