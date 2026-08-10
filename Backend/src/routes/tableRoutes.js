import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/tables - Return real-time table statuses with active orders from database
router.get('/tables', async (req, res) => {
  try {
    const sql = `
      SELECT t.id, t.table_number AS name, t.capacity AS seats, t.status,
             o.id AS "activeOrderId", o.order_number, o.total_amount, o.order_status, o.created_at AS "orderCreatedAt"
      FROM tables t
      LEFT JOIN orders o ON t.id = o.table_id AND o.order_status NOT IN ('completed', 'cancelled')
      ORDER BY t.table_number ASC
    `;
    const { rows } = await query(sql);

    const formattedTables = rows.map((r) => ({
      id: r.id,
      name: `Table ${r.name}`,
      seats: r.seats,
      status: r.activeOrderId ? 'Occupied' : (r.status || 'Available'),
      activeOrder: r.activeOrderId
        ? {
            id: r.activeOrderId,
            orderNumber: r.order_number,
            total: r.total_amount,
            status: r.order_status,
            createdAt: r.orderCreatedAt,
          }
        : undefined,
    }));

    return res.status(200).json({
      success: true,
      count: formattedTables.length,
      data: formattedTables,
    });
  } catch (error) {
    console.error('Error fetching tables:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tables',
      error: error.message,
    });
  }
});

// PATCH /api/tables/:id/status - Update table status
router.patch('/tables/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const sql = `
      UPDATE tables
      SET status = $1, updated_at = NOW()
      WHERE id = $2 OR CAST(table_number AS TEXT) = $2
      RETURNING *
    `;
    const { rows } = await query(sql, [status, id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Table '${id}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Table '${id}' status updated to ${status}`,
      data: rows[0],
    });
  } catch (error) {
    console.error('Error updating table status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update table status',
      error: error.message,
    });
  }
});

export default router;
