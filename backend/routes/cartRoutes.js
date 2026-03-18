import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    await getCart(req, res);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    await addToCart(req, res);
  } catch (err) {
    next(err);
  }
});

router.put('/:productId', async (req, res, next) => {
  try {
    await updateCartItem(req, res);
  } catch (err) {
    next(err);
  }
});

router.delete('/:productId', async (req, res, next) => {
  try {
    await removeFromCart(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
