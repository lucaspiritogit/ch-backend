const ContainerMongo = require("../../service/ContainerMongo.js");
const CarritoModel = require("../../models/CarritoModel.js");

class CarritoMongoDAO extends ContainerMongo {
  constructor() {
    super("carrito", CarritoModel.carritoSchema);
  }

  async createCarrito() {
    try {
      return await CarritoModel.create({});
    } catch (error) {
      throw error;
    }
  }

  async addProductToCarrito(productId, carritoId) {
    try {
      const carrito = await CarritoModel.findById(carritoId);
      carrito.products.push(productId);
      carrito.save();
    } catch (error) {
      throw error;
    }
  }
  async removeProductFromCarrito(productId, carritoId) {
    try {
      const carrito = await CarritoModel.findById(carritoId);
      carrito.products.splice(productId, 1);
      carrito.save();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CarritoMongoDAO;
