import { Router } from 'express';
import { initialOrders } from '../data/initialOrders.js';

const router = Router();
export let ordersStore = [...initialOrders];

// GET /api/orders - Get all orders
router.get('/orders', (req, res) => {
  try {
    const { status, type, limit } = req.query;
    let list = [...ordersStore];

    if (status) {
      list = list.filter((o) => o.status.toLowerCase() === status.toLowerCase());
    }
    if (type) {
      list = list.filter((o) => o.type.toLowerCase() === type.toLowerCase());
    }

    if (limit) {
      list = list.slice(0, parseInt(limit, 10));
    }

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message,
    });
  }
});

// GET /api/orders/:id - Get single order details
router.get('/orders/:id', (req, res) => {
  try {
    const order = ordersStore.find((o) => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order '${req.params.id}' not found`,
      });
    }
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message,
    });
  }
});

// POST /api/orders - Create a new order (POS / Customer)
router.post('/orders', (req, res) => {
  try {
    const { table, type, cartItems, paymentMethod } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart cannot be empty',
      });
    }

    const rawSubtotal = cartItems.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
    const vat = rawSubtotal * 0.12;
    const total = Math.round(rawSubtotal + vat);

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      table: table || 'Take Out',
      type: type || 'Take Out',
      status: 'Pending',
      paymentStatus: 'Paid',
      paymentMethod: paymentMethod || 'Cash',
      subtotal: rawSubtotal,
      vat: Math.round(vat),
      total,
      createdAt: new Date().toISOString(),
      cartItems,
    };

    ordersStore.unshift(newOrder);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const orderIndex = ordersStore.findIndex((o) => o.id === req.params.id);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Order '${req.params.id}' not found`,
      });
    }

    ordersStore[orderIndex].status = status;

    return res.status(200).json({
      success: true,
      message: `Order ${req.params.id} status updated to ${status}`,
      data: ordersStore[orderIndex],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
});

export default router;
