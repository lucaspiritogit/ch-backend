import mongoose from 'mongoose';

export const CartSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'productos' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  timestamp: { type: Date, default: Date.now },
});
export interface Cart {
  products: [string];
  userId: string;
  timestamp: Date;
}
