import { Router } from "express";
import { checkAuth } from '../controller/auth.controller.js'
import { User } from '../models/user.model.js'

const router = Router();

// Add logging middleware to see if requests are reaching these routes
router.use((req, res, next) => {
  console.log(`Auth route accessed: ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

// Test endpoint to check database connection
router.get('/test', async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ 
      message: 'Database connection working', 
      userCount: users.length,
      users: users 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/callback', checkAuth)
router.post('/sync-user', checkAuth)

export default router;