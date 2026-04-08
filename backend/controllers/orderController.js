const { Order, OrderItem, Product, User, sequelize } = require('../models');

exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, payment_method, upi_id } = req.body; // [{ product_id, quantity }]
    if (!items || !items.length)
      return res.status(400).json({ message: 'Cart is empty' });

    if (!payment_method || !['card', 'upi', 'razorpay'].includes(payment_method))
      return res.status(400).json({ message: 'Valid payment method required' });

    let total = 0;
    let allStockAvailable = true;
    const enriched = [];

    // First pass: validate all items and check stock
    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (!product) throw new Error(`Product ${item.product_id} not found`);
      if (product.stock < item.quantity) {
        allStockAvailable = false; // Mark as not fully available
      }

      const subtotal = parseFloat(product.price) * item.quantity;
      total += subtotal;
      enriched.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Second pass: deduct stock only for items that are available
    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (product.stock >= item.quantity) {
        await product.update(
          { stock: product.stock - item.quantity },
          { transaction: t }
        );
      }
    }

    // Auto-confirm order if all stock is available, otherwise keep as pending
    const orderStatus = allStockAvailable ? 'confirmed' : 'pending';

    const order = await Order.create(
      { 
        user_id: req.user.id, 
        total_price: total.toFixed(2), 
        payment_method, 
        payment_status: 'completed',
        status: orderStatus
      },
      { transaction: t }
    );

    for (const oi of enriched)
      await OrderItem.create({ ...oi, order_id: order.id }, { transaction: t });

    await t.commit();
    res.status(201).json({ 
      message: allStockAvailable ? 'Order confirmed! ✓' : 'Order pending admin approval',
      order_id: order.id, 
      total,
      payment_method,
      payment_status: 'completed',
      status: orderStatus,
      auto_confirmed: allStockAvailable
    });
  } catch (err) {
    await t.rollback();
    res.status(400).json({ message: err.message });
  }
};

exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: OrderItem,
        include: [{ model: Product, attributes: ['id', 'name', 'image_url', 'price'] }]
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// fetch single order for owner or admin
exports.getOne = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, include: [{ model: Product, attributes: ['id','name','price','image_url'] }] },
        { model: User, attributes: ['id','name','email'] }
      ]
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // if not admin make sure user owns it
    if (req.user.role !== 'admin' && order.user_id !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.allOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['name', 'email'] },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'price'] }]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'shipped', 'delivered'];
    if (!allowed.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.update({ status });
    res.json({ message: 'Status updated', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};