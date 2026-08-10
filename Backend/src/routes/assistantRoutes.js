import { Router } from 'express';

const router = Router();

let assistantCalls = [
  {
    id: "CALL-001",
    table: "Table 3",
    type: "Water Refill",
    status: "Pending", // Pending, Attended, Resolved
    timestamp: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: "CALL-002",
    table: "Table 7",
    type: "Request Bill",
    status: "Pending",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString()
  }
];

// GET /api/assistant/calls - Get active table assistance requests
router.get('/assistant/calls', (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: assistantCalls.length,
      data: assistantCalls,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve assistant calls',
      error: error.message,
    });
  }
});

// POST /api/assistant/call - Trigger table assistance request
router.post('/assistant/call', (req, res) => {
  try {
    const { table, type } = req.body;
    if (!table) {
      return res.status(400).json({
        success: false,
        message: 'Table location is required',
      });
    }

    const newCall = {
      id: `CALL-${Date.now().toString().slice(-3)}`,
      table,
      type: type || 'Call Waiter',
      status: 'Pending',
      timestamp: new Date().toISOString(),
    };

    assistantCalls.unshift(newCall);

    return res.status(201).json({
      success: true,
      message: 'Assistance request sent to floor team',
      data: newCall,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create assistance request',
      error: error.message,
    });
  }
});

// PATCH /api/assistant/calls/:id/resolve - Resolve assistance call
router.patch('/assistant/calls/:id/resolve', (req, res) => {
  try {
    const callIndex = assistantCalls.findIndex((c) => c.id === req.params.id);
    if (callIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Call '${req.params.id}' not found`,
      });
    }

    assistantCalls[callIndex].status = 'Resolved';

    return res.status(200).json({
      success: true,
      message: `Call '${req.params.id}' resolved`,
      data: assistantCalls[callIndex],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to resolve assistance call',
      error: error.message,
    });
  }
});

export default router;
