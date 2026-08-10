import { Router } from 'express';
import { initialUsers } from '../data/initialUsers.js';

const router = Router();
let usersStore = [...initialUsers];

// GET /api/users - Get all users
router.get('/users', (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: usersStore.length,
      data: usersStore,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message,
    });
  }
});

// POST /api/auth/login - User authentication login
router.post('/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required',
      });
    }

    const user = usersStore.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or user not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Login successful for ${user.fullname}`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Login authentication failed',
      error: error.message,
    });
  }
});

// POST /api/auth/register - Create new user account
router.post('/auth/register', (req, res) => {
  try {
    const { fullname, username, email, role, token } = req.body;

    if (!fullname || !username || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (fullname, username, email)',
      });
    }

    const selectedRole = role || 'customer';

    // Staff role verification token check
    if (selectedRole !== 'customer') {
      if (!token || token.toUpperCase() !== 'SFB-STAFF-99') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Invalid Employee Access Token for staff account.',
        });
      }
    }

    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      fullname,
      username,
      email,
      role: selectedRole,
      createdAt: new Date().toISOString(),
    };

    usersStore.push(newUser);

    return res.status(201).json({
      success: true,
      message: `Account created successfully for ${fullname}`,
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'User registration failed',
      error: error.message,
    });
  }
});

export default router;
