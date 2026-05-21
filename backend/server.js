require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { sequelize } = require('./models');

const app = express();

app.use(cors({
  origin: [
    'http://YOUR_PUBLIC_IP',
    'http://YOUR_PUBLIC_IP:5173'
  ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));

app.get('/api/health', (req, res) =>
  res.json({ status: 'SHYNIA API running ✓' })
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 6000;

sequelize.sync({ force: false, alter: false })
  .then(() => {
    console.log('✓ MySQL connected & models synced');
    app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB connection error:', err));
