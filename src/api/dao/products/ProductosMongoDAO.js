const mongoose = require("mongoose");
const ContainerMongo = require("../../service/ContainerMongo.js");
const ProductoModel = require("../../models/ProductModel.js");

class ProductosMongoDAO extends ContainerMongo {
  constructor() {
    super("productos", ProductoModel.productoSchema);
  }
}

module.exports = ProductosMongoDAO;
