const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  image_url: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  category: {
    type: DataTypes.ENUM('Gel', 'Matte', 'Glossy'),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },
  sale_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: { min: 0 }
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 4.8,
    validate: { min: 0, max: 5 }
  },
  reviews_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0 }
  },
  badge_type: {
    type: DataTypes.ENUM('NEW', 'BESTSELLER', 'HOT SELLER'),
    allowNull: true,
    defaultValue: null
  },
  is_cruelty_free: {
    type: DataTypes.TINYINT(1),
    defaultValue: 1
  },
  is_vegan: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0
  },
  colors: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of available color variants'
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Product;