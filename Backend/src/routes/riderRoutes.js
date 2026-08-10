import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/rider/deliveries - Get active delivery jobs
router.get('/rider/deliveries', async (req, res) => {
  try {
    const sql = `
      SELECT o.*, c.fullname AS customer_name, c.phone AS customer_phone, c.delivery_address,
             e.fullname AS rider_name,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'menu_item_id', oi.menu_item_id,
                   'quantity', oi.quantity,
                   'unit_price', oi.unit_price,
                   'subtotal', oi.subtotal,
                   'name', m.name
                 )
               ) FILTER (WHERE oi.id IS NOT NULL), '[]'
             ) AS "items"
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN employees e ON o.employee_id = e.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items m ON oi.menu_item_id = m.id
      WHERE LOWER(o.order_type) = 'delivery'
      GROUP BY o.id, c.fullname, c.phone, c.delivery_address, e.fullname
      ORDER BY o.created_at DESC
    `;
    const { rows } = await query(sql);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching rider deliveries:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve delivery jobs',
      error: error.message,
    });
  }
});

// PATCH /api/rider/deliveries/:id/status - Update delivery status
router.patch('/rider/deliveries/:id/status', async (req, res) => {
  try {
    const { status, employeeId } = req.body;
    const { id } = req.params;

    let sql = `
      UPDATE orders
      SET order_status = $1, updated_at = NOW()
    `;
    const params = [status];
    let paramIndex = 2;

    if (employeeId) {
      sql += `, employee_id = $${paramIndex++}`;
      params.push(employeeId);
    }

    sql += ` WHERE (id = $${paramIndex} OR order_number = $${paramIndex}) RETURNING *`;
    params.push(id);

    const { rows } = await query(sql, params);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Delivery order '${id}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Delivery '${id}' status updated to ${status}`,
      data: rows[0],
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update delivery status',
      error: error.message,
    });
  }
});

export default router;
