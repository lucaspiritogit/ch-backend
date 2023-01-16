import mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  title: { type: String },
  price: { type: Number },
  code: { type: String },
  stock: { type: Number },
  description: { type: String },
  thumbnail: { type: String },
});
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  code: string;
  stock: number;
  thumbnail: string;
}
