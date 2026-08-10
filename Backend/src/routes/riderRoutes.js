import { Router } from 'express';
import { initialOrders } from '../data/initialOrders.js';

const router = Router();

// GET /api/rider/deliveries - Get active delivery jobs
router.get('/rider/deliveries', (req, res) => {
  try {
    const deliveries = initialOrders.filter(
      (o) => o.type === 'Delivery' || o.riderName !== undefined
    );

    return res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve delivery jobs',
      error: error.message,
    });
  }
});

// PATCH /api/rider/deliveries/:id/status - Update delivery progress
router.patch('/rider/deliveries/:id/status', (req, res) => {
  try {
    const { status, riderName } = req.body;
    const delivery = initialOrders.find((o) => o.id === req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: `Delivery '${req.params.id}' not found`,
      });
    }

    if (status) delivery.status = status;
    if (riderName) delivery.riderName = riderName;

    return res.status(200).json({
      success: true,
      message: `Delivery '${req.params.id}' updated to ${status}`,
      data: delivery,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update delivery status',
      error: error.message,
    });
  }
});

export default router;
