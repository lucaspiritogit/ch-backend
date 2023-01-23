const ContainerMongo = require('../../containers/ContainerMongo.js');
const CarritoModel = require('../../models/CarritoModel.js');

class CarritoMongoDAO extends ContainerMongo {
  constructor() {
    super('carrito', CarritoModel.carritoSchema);
  }

  async createNewCarritoWithoutUser() {
    try {
      return await CarritoModel.create({});
    } catch (error) {
      throw error;
    }
  }

  async createNewCarrito(userId) {
    try {
      return await CarritoModel.create({
        userId: userId,
      });
    } catch (error) {
      throw error;
    }
  }

  async getCarritoByUserId(userId) {
    try {
      let cart = await CarritoModel.findOne({ userId });
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCarrito(productId, carritoId) {
    try {
      const carrito = await CarritoModel.findById(carritoId);
      carrito.products.push(productId);
      await carrito.save();
      return carrito;
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

  async deleteAllProductsFromCarrito(carritoId) {
    try {
      const carrito = await CarritoModel.findById(carritoId);
      if (!carrito) throw new Error('Carrito no encontrado');
      carrito.products = [];
      carrito.save();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CarritoMongoDAO;
