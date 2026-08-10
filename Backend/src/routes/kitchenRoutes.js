import { Router } from 'express';
import { ordersStore } from './orderRoutes.js';

const router = Router();

// GET /api/kitchen/orders - Get active kitchen order tickets
router.get('/kitchen/orders', (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: ordersStore.length,
      data: ordersStore,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve kitchen tickets',
      error: error.message,
    });
  }
});

// PATCH /api/kitchen/orders/:id/status - Advance kitchen ticket status
router.patch('/kitchen/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const ticket = ordersStore.find((o) => o.id === req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Kitchen ticket '${req.params.id}' not found`,
      });
    }

    ticket.status = status;

    return res.status(200).json({
      success: true,
      message: `Kitchen ticket '${req.params.id}' marked as ${status}`,
      data: ticket,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update kitchen ticket status',
      error: error.message,
    });
  }
});

// DELETE /api/kitchen/orders/:id - Delete order ticket from kitchen
router.delete('/kitchen/orders/:id', (req, res) => {
  try {
    const index = ordersStore.findIndex((o) => o.id === req.params.id);
    if (index !== -1) {
      ordersStore.splice(index, 1);
    }
    return res.status(200).json({
      success: true,
      message: `Kitchen ticket '${req.params.id}' deleted`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete kitchen ticket',
      error: error.message,
    });
  }
});

export default router;
