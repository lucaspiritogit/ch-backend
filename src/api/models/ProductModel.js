const mongoose = require("mongoose");
const { Schema } = mongoose;

const productoSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  title: { type: String },
  price: { type: Number },
  code: { type: String },
  stock: { type: Number },
  description: { type: String },
  thumbnail: { type: String },
});

const ProductoModel = mongoose.model("productos", productoSchema);

module.exports = ProductoModel;
