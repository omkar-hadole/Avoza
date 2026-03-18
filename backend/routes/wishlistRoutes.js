import express from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    await getWishlist(req, res);
  } catch (err) {
    next(err);
  }
});

router.post('/:productId', async (req, res, next) => {
  try {
    await toggleWishlist(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
