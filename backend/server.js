require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { sequelize } = require('./models');

const app = express();

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/banners',  require('./routes/banners'));

app.get('/api/health', (req, res) =>
  res.json({ status: 'SHYNIA API running ✓' })
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;

async function initDB() {
  try {
    // Test connection first
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Sync database (create tables if they don't exist, alter if needed)
    // Use FORCE_DB_RESET=true in .env to force recreate tables
    const forceReset = process.env.FORCE_DB_RESET === 'true';
    await sequelize.sync({ force: forceReset });
    console.log(`✓ MySQL connected & models synced${forceReset ? ' (forced reset)' : ''}`);

    // Seed database with initial data if empty
    if (!forceReset) {
      console.log('🔍 Checking if database needs seeding...');
      try {
        const productCount = await sequelize.models.Product.count();
        console.log(`📊 Found ${productCount} products in database`);
        if (productCount === 0) {
          console.log('🌱 Seeding database with initial data...');
          await require('./seed')();
        } else {
          console.log(`✓ Database has ${productCount} products`);
        }
      } catch (error) {
        console.error('❌ Error checking/seeding database:', error.message);
      }
    } else {
      console.log('🔄 Database was reset, seeding will happen on next normal start');
    }

    // Start server
    app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));
  } catch (err) {
    console.error('DB init error:', err.message);
    process.exit(1);
  }
}

initDB();