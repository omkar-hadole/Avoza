import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    images: [
      {
        type: String,
        required: true,
      }
    ],
    category: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    featured: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
