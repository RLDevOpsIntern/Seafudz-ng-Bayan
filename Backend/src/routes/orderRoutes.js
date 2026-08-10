import { Router } from 'express';
import { query, getDbPool } from '../config/db.js';

const router = Router();

// GET /api/orders - Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { status, type, limit } = req.query;
    let sql = `
      SELECT o.*, t.table_number,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'menu_item_id', oi.menu_item_id,
                   'quantity', oi.quantity,
                   'unit_price', oi.unit_price,
                   'subtotal', oi.subtotal,
                   'notes', oi.item_notes,
                   'name', m.name
                 )
               ) FILTER (WHERE oi.id IS NOT NULL), '[]'
             ) AS "items"
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items m ON oi.menu_item_id = m.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND LOWER(o.order_status) = LOWER($${paramIndex++})`;
      params.push(status);
    }

    if (type) {
      sql += ` AND LOWER(o.order_type) = LOWER($${paramIndex++})`;
      params.push(type);
    }

    sql += ` GROUP BY o.id, t.table_number ORDER BY o.created_at DESC`;

    if (limit) {
      sql += ` LIMIT $${paramIndex++}`;
      params.push(parseInt(limit, 10));
    }

    const { rows } = await query(sql, params);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message,
    });
  }
});

// GET /api/orders/:id - Get single order details
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT o.*, t.table_number,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'menu_item_id', oi.menu_item_id,
                   'quantity', oi.quantity,
                   'unit_price', oi.unit_price,
                   'subtotal', oi.subtotal,
                   'notes', oi.item_notes,
                   'name', m.name
                 )
               ) FILTER (WHERE oi.id IS NOT NULL), '[]'
             ) AS "items"
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items m ON oi.menu_item_id = m.id
      WHERE o.id = $1 OR o.order_number = $1
      GROUP BY o.id, t.table_number
    `;
    const { rows } = await query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Order '${id}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message,
    });
  }
});

// POST /api/orders - Create a new order with transaction
router.post('/orders', async (req, res) => {
  const pool = await getDbPool();
  const client = await pool.connect();

  try {
    const { tableId, type, cartItems, paymentMethod, notes } = req.body;

    if (!cartItems || cartItems.length === 0) {
      client.release();
      return res.status(400).json({
        success: false,
        message: 'Cart cannot be empty',
      });
    }

    await client.query('BEGIN');

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const subtotal = cartItems.reduce((acc, ci) => {
      const price = ci.item ? ci.item.price : (ci.price || 0);
      return acc + (price * ci.quantity);
    }, 0);
    const tax = Math.round(subtotal * 0.12 * 100) / 100;
    const totalAmount = subtotal + tax;

    const orderSql = `
      INSERT INTO orders (
        order_number, table_id, order_type, payment_method,
        payment_status, order_status, subtotal, tax, total_amount, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const orderRes = await client.query(orderSql, [
      orderNumber,
      tableId || null,
      type || 'dine_in',
      paymentMethod || 'cash',
      'paid',
      'pending',
      subtotal,
      tax,
      totalAmount,
      notes || null,
    ]);

    const createdOrder = orderRes.rows[0];

    // Insert order items
    for (const ci of cartItems) {
      const menuItemId = ci.item ? ci.item.id : ci.menuItemId;
      const unitPrice = ci.item ? ci.item.price : (ci.price || 0);
      const itemSubtotal = unitPrice * ci.quantity;

      const itemSql = `
        INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal, item_notes)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      await client.query(itemSql, [
        createdOrder.id,
        menuItemId,
        ci.quantity,
        unitPrice,
        itemSubtotal,
        ci.notes || null,
      ]);
    }

    await client.query('COMMIT');
    client.release();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully in database',
      data: createdOrder,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    client.release();
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order in database',
      error: error.message,
    });
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const sql = `
      UPDATE orders
      SET order_status = $1, updated_at = NOW()
      WHERE id = $2 OR order_number = $2
      RETURNING *
    `;
    const { rows } = await query(sql, [status, id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Order '${id}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order ${id} status updated to ${status}`,
      data: rows[0],
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
});

export default router;
