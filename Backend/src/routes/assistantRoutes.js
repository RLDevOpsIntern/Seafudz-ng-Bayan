import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/assistant/calls - Get active table assistance requests
router.get('/assistant/calls', async (req, res) => {
  try {
    const sql = `
      SELECT ac.id, ac.call_type AS type, ac.status, ac.created_at AS timestamp,
             t.table_number, t.id AS table_id
      FROM assistant_calls ac
      LEFT JOIN tables t ON ac.table_id = t.id
      ORDER BY ac.created_at DESC
    `;
    const { rows } = await query(sql);

    const formattedCalls = rows.map((r) => ({
      id: r.id,
      table: r.table_number ? `Table ${r.table_number}` : 'Floor',
      tableId: r.table_id,
      type: r.type,
      status: r.status,
      timestamp: r.timestamp,
    }));

    return res.status(200).json({
      success: true,
      count: formattedCalls.length,
      data: formattedCalls,
    });
  } catch (error) {
    console.error('Error fetching assistant calls:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve assistant calls',
      error: error.message,
    });
  }
});

// POST /api/assistant/call - Trigger table assistance request
router.post('/assistant/call', async (req, res) => {
  try {
    const { tableId, table, type } = req.body;

    const sql = `
      INSERT INTO assistant_calls (table_id, call_type, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const { rows } = await query(sql, [tableId || null, type || 'Call Waiter', 'pending']);

    return res.status(201).json({
      success: true,
      message: 'Assistance request sent to floor team',
      data: rows[0],
    });
  } catch (error) {
    console.error('Error creating assistant call:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create assistance request',
      error: error.message,
    });
  }
});

// PATCH /api/assistant/calls/:id/resolve - Resolve assistance call
router.patch('/assistant/calls/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    const sql = `
      UPDATE assistant_calls
      SET status = 'resolved', responded_by_employee_id = $1, resolved_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const { rows } = await query(sql, [employeeId || null, id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Call '${id}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Call '${id}' resolved`,
      data: rows[0],
    });
  } catch (error) {
    console.error('Error resolving assistant call:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to resolve assistance call',
      error: error.message,
    });
  }
});

export default router;
