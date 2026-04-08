const express = require('express');
const { Banner } = require('../models');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Get all active banners (public)
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.findAll({
      where: { is_active: true },
      order: [['display_order', 'ASC']]
    });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all banners (admin)
router.get('/admin/all', auth, admin, async (req, res) => {
  try {
    const banners = await Banner.findAll({
      order: [['display_order', 'ASC']]
    });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single banner
router.get('/:id', async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create banner (admin)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { title, subtitle, cta_text, background_color, text_color, image_url, display_order } = req.body;
    const banner = await Banner.create({
      title,
      subtitle,
      cta_text,
      background_color,
      text_color,
      image_url,
      display_order
    });
    res.status(201).json(banner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update banner (admin)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    
    const { title, subtitle, cta_text, background_color, text_color, image_url, display_order, is_active } = req.body;
    await banner.update({
      title,
      subtitle,
      cta_text,
      background_color,
      text_color,
      image_url,
      display_order,
      is_active
    });
    res.json(banner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete banner (admin)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    await banner.destroy();
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
