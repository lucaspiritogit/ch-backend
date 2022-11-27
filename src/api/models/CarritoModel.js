const mongoose = require("mongoose");
const { Schema } = mongoose;

const carritoSchema = new Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "productos" }],
  timestamp: { type: Date, default: Date.now },
});

const CarritoModel = mongoose.model("carrito", carritoSchema);

module.exports = CarritoModel;
