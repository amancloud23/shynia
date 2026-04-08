const Product = require('../models/Product');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    const where = {};
    if (category) where.category = category;
    if (search)   where.name = { [Op.like]: `%${search}%` };

    let order = [['created_at', 'DESC']];
    if (sort === 'price_asc')  order = [['price', 'ASC']];
    if (sort === 'price_desc') order = [['price', 'DESC']];

    const products = await Product.findAll({ where, order });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, price, image_url, category, stock } = req.body;
    if (!name || !price || !category)
      return res.status(400).json({ message: 'Name, price and category are required' });

    let finalImageUrl = image_url;
    if (req.file) {
      finalImageUrl = '/uploads/' + req.file.filename;
    }

    const product = await Product.create({ name, description, price, image_url: finalImageUrl, category, stock });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

exports.update = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, image_url, category, stock } = req.body;
    let finalImageUrl = image_url;
    if (req.file) {
      finalImageUrl = '/uploads/' + req.file.filename;
    }

    await product.update({ name, description, price, image_url: finalImageUrl, category, stock });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};