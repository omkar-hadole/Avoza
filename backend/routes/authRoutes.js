import express from 'express';
import { authUser, registerUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    await registerUser(req, res);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    await authUser(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/profile', protect, async (req, res, next) => {
  try {
    await getUserProfile(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
