import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/kitchen/orders - Get active kitchen order tickets
router.get('/kitchen/orders', async (req, res) => {
  try {
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
      WHERE o.order_status IN ('pending', 'in_kitchen', 'cooking', 'preparing')
      GROUP BY o.id, t.table_number
      ORDER BY o.created_at ASC
    `;
    const { rows } = await query(sql);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching kitchen orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve kitchen tickets',
      error: error.message,
    });
  }
});

// PATCH /api/kitchen/orders/:id/status - Update ticket status
router.patch('/kitchen/orders/:id/status', async (req, res) => {
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
        message: `Kitchen ticket '${id}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Kitchen ticket '${id}' updated to ${status}`,
      data: rows[0],
    });
  } catch (error) {
    console.error('Error updating kitchen order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update kitchen ticket status',
      error: error.message,
    });
  }
});

// DELETE /api/kitchen/orders/:id - Cancel/remove ticket
router.delete('/kitchen/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      UPDATE orders
      SET order_status = 'cancelled', updated_at = NOW()
      WHERE id = $1 OR order_number = $1
      RETURNING id
    `;
    await query(sql, [id]);

    return res.status(200).json({
      success: true,
      message: `Kitchen ticket '${id}' updated to cancelled`,
    });
  } catch (error) {
    console.error('Error deleting kitchen order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete kitchen ticket',
      error: error.message,
    });
  }
});

export default router;
