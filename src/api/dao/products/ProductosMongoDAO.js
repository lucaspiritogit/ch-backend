const mongoose = require("mongoose");
const ContainerMongo = require("../../service/ContainerMongo.js");

const productoSchema = new mongoose.Schema({
  title: { type: String, require: true, max: 100 },
  price: { type: Number, require: true, max: 10000 },
  timestamp: { type: String, require: true, max: 10000 },
  code: { type: String, require: true, max: 100 },
  stock: { type: Number, require: true, max: 10000 },
  description: { type: String, require: true, max: 100 },
  thumbnail: { type: String, require: true, max: 100 },
});

class ProductosMongoDAO extends ContainerMongo {
  constructor() {
    super("productos", productoSchema);
  }
}

module.exports = ProductosMongoDAO;
