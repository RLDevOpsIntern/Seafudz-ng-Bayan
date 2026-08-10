import { Router } from 'express';
import { initialOrders } from '../data/initialOrders.js';

const router = Router();

// GET /api/sales/summary - Get sales summary analytics
router.get('/sales/summary', (req, res) => {
  try {
    const totalOrdersCount = initialOrders.length;
    const totalGrossRevenue = initialOrders.reduce((acc, o) => acc + o.total, 0);
    const totalSubtotal = initialOrders.reduce((acc, o) => acc + o.subtotal, 0);
    const totalVat = initialOrders.reduce((acc, o) => acc + o.vat, 0);

    const paymentMethodsBreakdown = {};
    initialOrders.forEach((o) => {
      const pm = o.paymentMethod || 'Cash';
      paymentMethodsBreakdown[pm] = (paymentMethodsBreakdown[pm] || 0) + o.total;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalOrders: totalOrdersCount,
        grossRevenue: totalGrossRevenue,
        subtotalRevenue: totalSubtotal,
        vatCollected: totalVat,
        averageOrderValue: Math.round(totalGrossRevenue / (totalOrdersCount || 1)),
        paymentMethods: paymentMethodsBreakdown,
        topDishes: [
          { name: "Seafood Bilao Feast", quantitySold: 28, revenue: 67200 },
          { name: "Garlic Butter Crab Bucket", quantitySold: 22, revenue: 55000 },
          { name: "Spicy Cajun Shrimp", quantitySold: 35, revenue: 42000 }
        ]
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate sales summary',
      error: error.message,
    });
  }
});

// GET /api/sales/transactions - Get list of sales ledger transactions
router.get('/sales/transactions', (req, res) => {
  try {
    const transactions = initialOrders.map((o) => ({
      transactionId: `TXN-${o.id}`,
      orderId: o.id,
      date: o.createdAt,
      type: o.type,
      paymentMethod: o.paymentMethod,
      totalAmount: o.total,
    }));

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve transactions ledger',
      error: error.message,
    });
  }
});

export default router;
