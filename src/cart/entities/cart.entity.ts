import mongoose from 'mongoose';
import { Product } from 'src/product/product.model';

export const CartSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'productos' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  timestamp: { type: Date, default: Date.now },
});
export interface Cart {
  products: [Product];
  userId: string;
  timestamp: Date;
}
