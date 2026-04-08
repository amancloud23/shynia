require('dotenv').config();
const { sequelize, Product, User, Banner } = require('./models');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Check if data already exists
    const productCount = await Product.count();
    const userCount = await User.count();

    if (productCount > 0) {
      console.log(`⚠️  Database already has ${productCount} products. Skipping seed.`);
      console.log('💡 To force reseed, run: FORCE_DB_RESET=true npm start');
      return;
    }

    console.log('📦 Adding sample products...');

    // Sample products
    const products = [
      {
        name: 'Rose Petal Dreams',
        description: 'A delicate blush rose gel polish with mirror shine finish',
        price: 18.99,
        category: 'Gel',
        stock: 50,
        rating: 4.8,
        reviews_count: 0,
        is_cruelty_free: true,
        is_vegan: false
      },
      {
        name: 'Midnight Noir',
        description: 'Deep black matte polish — bold, sophisticated, timeless',
        price: 16.99,
        category: 'Matte',
        stock: 35,
        rating: 4.8,
        reviews_count: 0,
        is_cruelty_free: true,
        is_vegan: false
      },
      {
        name: 'Champagne Toast',
        description: 'Effervescent gold glossy polish perfect for celebrations',
        price: 17.99,
        category: 'Glossy',
        stock: 40,
        rating: 4.8,
        reviews_count: 0,
        is_cruelty_free: true,
        is_vegan: false
      },
      {
        name: 'Nude Serenity',
        description: 'Classic nude gel polish, your everyday elegant companion',
        price: 15.99,
        category: 'Gel',
        stock: 60,
        rating: 4.8,
        reviews_count: 0,
        is_cruelty_free: true,
        is_vegan: false
      },
      {
        name: 'Berry Bliss',
        description: 'Rich burgundy matte — intense colour with velvety finish',
        price: 16.99,
        category: 'Matte',
        stock: 28,
        rating: 4.8,
        reviews_count: 0,
        is_cruelty_free: true,
        is_vegan: false
      },
      {
        name: 'Peachy Keen',
        description: 'Warm peach glossy polish — radiant summer vibes',
        price: 17.99,
        category: 'Glossy',
        stock: 45,
        rating: 4.8,
        reviews_count: 0,
        is_cruelty_free: true,
        is_vegan: false
      }
    ];

    await Product.bulkCreate(products);
    console.log(`✅ Added ${products.length} products`);

    // Create admin user if no users exist
    if (userCount === 0) {
      console.log('👤 Creating admin user...');
      const bcrypt = require('bcryptjs');
      const hashed = await bcrypt.hash('admin123', 12);
      await User.create({
        name: 'Admin User',
        email: 'admin@shynia.com',
        password: hashed,
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@shynia.com / admin123');
    }

    console.log('🎉 Database seeded successfully!');
    console.log('💡 Login with: admin@shynia.com / admin123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;