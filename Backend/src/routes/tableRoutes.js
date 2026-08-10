import { Router } from 'express';
import { ordersStore } from './orderRoutes.js';

const router = Router();

// Store initial restaurant table layouts
export let tablesStore = [
  { id: 'Table 1', name: 'Table 1', seats: 4, section: 'Main Dining', status: 'Available', shape: 'square' },
  { id: 'Table 2', name: 'Table 2', seats: 2, section: 'Main Dining', status: 'Available', shape: 'round' },
  { id: 'Table 3', name: 'Table 3', seats: 6, section: 'Main Dining', status: 'Available', shape: 'rectangle' },
  { id: 'Table 4', name: 'Table 4', seats: 4, section: 'Main Dining', status: 'Available', shape: 'square' },
  { id: 'Table 5', name: 'Table 5', seats: 8, section: 'VIP Family Alcove', status: 'Available', shape: 'rectangle' },
  { id: 'Table 6', name: 'Table 6', seats: 4, section: 'VIP Family Alcove', status: 'Available', shape: 'round' },
  { id: 'Table 7', name: 'Table 7', seats: 2, section: 'Alfresco Patio', status: 'Available', shape: 'round' },
  { id: 'Table 8', name: 'Table 8', seats: 4, section: 'Alfresco Patio', status: 'Available', shape: 'square' },
  { id: 'Table 9', name: 'Table 9', seats: 6, section: 'Alfresco Patio', status: 'Available', shape: 'rectangle' },
  { id: 'Table 10', name: 'Table 10', seats: 4, section: 'Main Dining', status: 'Available', shape: 'square' },
  { id: 'Table 11', name: 'Table 11', seats: 2, section: 'Main Dining', status: 'Available', shape: 'round' },
  { id: 'Table 12', name: 'Table 12', seats: 8, section: 'VIP Bilao Party', status: 'Available', shape: 'rectangle' },
];

const isTableMatch = (orderTable, tableName) => {
  if (!orderTable || !tableName) return false;
  const o = String(orderTable).toLowerCase();
  const t = String(tableName).toLowerCase();
  return o === t || o.includes(t);
};

// GET /api/tables - Return real-time table statuses with active orders
router.get('/tables', (req, res) => {
  try {
    const updatedTables = tablesStore.map((table) => {
      // Find active order for this table
      const activeOrder = ordersStore.find(
        (o) =>
          isTableMatch(o.table, table.name) &&
          o.status !== 'Completed' &&
          o.status !== 'Served' &&
          o.status !== 'Cancelled'
      );

      if (activeOrder) {
        return {
          ...table,
          status: 'Occupied',
          activeOrder: {
            id: activeOrder.id,
            total: activeOrder.total,
            itemsCount: activeOrder.cartItems ? activeOrder.cartItems.length : 0,
            status: activeOrder.status,
            createdAt: activeOrder.createdAt,
          },
        };
      }

      return {
        ...table,
        status: 'Available',
        activeOrder: undefined,
      };
    });

    return res.status(200).json({
      success: true,
      count: updatedTables.length,
      data: updatedTables,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tables',
      error: error.message,
    });
  }
});

// PATCH /api/tables/:id/status - Update table status manually
router.patch('/tables/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const tableIndex = tablesStore.findIndex((t) => t.id === req.params.id || t.name === req.params.id);

    if (tableIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Table '${req.params.id}' not found`,
      });
    }

    tablesStore[tableIndex].status = status;

    return res.status(200).json({
      success: true,
      message: `Table '${req.params.id}' status updated to ${status}`,
      data: tablesStore[tableIndex],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update table status',
      error: error.message,
    });
  }
});

export default router;
