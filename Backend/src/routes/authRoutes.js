import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

// GET /api/users - Get all employees/users from database
router.get('/users', async (req, res) => {
  try {
    const sql = `
      SELECT id, supabase_user_id, fullname, username, email, role, shift_status, is_active, created_at
      FROM employees
      ORDER BY created_at DESC
    `;
    const { rows } = await query(sql);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message,
    });
  }
});

// POST /api/auth/login - Employee/User login check against database
router.post('/auth/login', async (req, res) => {
  try {
    const { username, pinCode } = req.body;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required',
      });
    }

    let sql = `SELECT * FROM employees WHERE LOWER(username) = LOWER($1)`;
    const params = [username];

    if (pinCode) {
      sql += ` AND pin_code = $2`;
      params.push(pinCode);
    }

    const { rows } = await query(sql, params);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or employee not found',
      });
    }

    const user = rows[0];

    return res.status(200).json({
      success: true,
      message: `Login successful for ${user.fullname}`,
      data: user,
    });
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Login authentication failed',
      error: error.message,
    });
  }
});

// POST /api/auth/register - Register new user/employee in database
router.post('/auth/register', async (req, res) => {
  try {
    const { fullname, username, email, role, pinCode, supabaseUserId, token } = req.body;

    if (!fullname || !username || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (fullname, username, email)',
      });
    }

    const selectedRole = role || 'cashier';

    if (selectedRole !== 'customer') {
      if (token && token.toUpperCase() !== 'SFB-STAFF-99') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Invalid Employee Access Token for staff account.',
        });
      }
    }

    const sql = `
      INSERT INTO employees (supabase_user_id, fullname, username, email, pin_code, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, supabase_user_id, fullname, username, email, role, is_active, created_at
    `;

    const { rows } = await query(sql, [
      supabaseUserId || null,
      fullname,
      username,
      email,
      pinCode || null,
      selectedRole,
    ]);

    return res.status(201).json({
      success: true,
      message: `Account created successfully for ${fullname}`,
      data: rows[0],
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      success: false,
      message: 'User registration failed',
      error: error.message,
    });
  }
});

export default router;
