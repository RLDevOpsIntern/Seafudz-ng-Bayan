import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/sales/summary - Get sales summary analytics from database
router.get('/sales/summary', async (req, res) => {
  try {
    const summarySql = `
      SELECT 
        COUNT(id)::int AS "totalOrders",
        COALESCE(SUM(total_amount), 0)::float AS "grossRevenue",
        COALESCE(SUM(subtotal), 0)::float AS "subtotalRevenue",
        COALESCE(SUM(tax), 0)::float AS "vatCollected",
        COALESCE(AVG(total_amount), 0)::float AS "averageOrderValue"
      FROM orders
      WHERE order_status != 'cancelled'
    `;
    const summaryRes = await query(summarySql);
    const summary = summaryRes.rows[0];

    const paymentSql = `
      SELECT payment_method, COALESCE(SUM(total_amount), 0)::float AS total
      FROM orders
      WHERE order_status != 'cancelled'
      GROUP BY payment_method
    `;
    const paymentRes = await query(paymentSql);
    const paymentMethods = {};
    paymentRes.rows.forEach((r) => {
      paymentMethods[r.payment_method || 'cash'] = r.total;
    });

    const topDishesSql = `
      SELECT m.name, 
             SUM(oi.quantity)::int AS "quantitySold", 
             SUM(oi.subtotal)::float AS "revenue"
      FROM order_items oi
      JOIN menu_items m ON oi.menu_item_id = m.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.order_status != 'cancelled'
      GROUP BY m.id, m.name
      ORDER BY "quantitySold" DESC
      LIMIT 5
    `;
    const topDishesRes = await query(topDishesSql);

    return res.status(200).json({
      success: true,
      data: {
        totalOrders: summary.totalOrders,
        grossRevenue: summary.grossRevenue,
        subtotalRevenue: summary.subtotalRevenue,
        vatCollected: summary.vatCollected,
        averageOrderValue: Math.round(summary.averageOrderValue),
        paymentMethods,
        topDishes: topDishesRes.rows,
      },
    });
  } catch (error) {
    console.error('Error generating sales summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate sales summary',
      error: error.message,
    });
  }
});

// GET /api/sales/transactions - Get list of transactions ledger from database
router.get('/sales/transactions', async (req, res) => {
  try {
    const sql = `
      SELECT id AS "orderId", 
             order_number AS "transactionId", 
             created_at AS "date", 
             order_type AS "type", 
             payment_method AS "paymentMethod", 
             total_amount AS "totalAmount",
             order_status AS "status"
      FROM orders
      ORDER BY created_at DESC
    `;
    const { rows } = await query(sql);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve transactions ledger',
      error: error.message,
    });
  }
});

export default router;
