const { Order, OrderItem, Product, User, sequelize } = require('../models');

exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items } = req.body; // [{ product_id, quantity }]
    if (!items || !items.length)
      return res.status(400).json({ message: 'Cart is empty' });

    let total = 0;
    const enriched = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (!product) throw new Error(`Product ${item.product_id} not found`);
      if (product.stock < item.quantity)
        throw new Error(`Insufficient stock for "${product.name}"`);

      const subtotal = parseFloat(product.price) * item.quantity;
      total += subtotal;
      enriched.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      });

      await product.update(
        { stock: product.stock - item.quantity },
        { transaction: t }
      );
    }

    const order = await Order.create(
      { user_id: req.user.id, total_price: total.toFixed(2) },
      { transaction: t }
    );

    for (const oi of enriched)
      await OrderItem.create({ ...oi, order_id: order.id }, { transaction: t });

    await t.commit();
    res.status(201).json({ message: 'Order placed successfully', order_id: order.id, total });
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