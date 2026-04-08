const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  cta_text: {
    type: DataTypes.STRING(100),
    defaultValue: 'Shop Now'
  },
  background_color: {
    type: DataTypes.STRING(50),
    defaultValue: '#d4538a'
  },
  text_color: {
    type: DataTypes.STRING(50),
    defaultValue: '#fff'
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'banners',
  timestamps: false,
  createdAt: false
});

module.exports = Banner;
