import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    await getProducts(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await getProductById(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
