const ContainerMongo = require("../../containers/ContainerMongo.js");
const CarritoModel = require("../../models/CarritoModel.js");

class CarritoMongoDAO extends ContainerMongo {
  constructor() {
    super("carrito", CarritoModel.carritoSchema);
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

  async getCarritoById(carritoId) {
    try {
      return await CarritoModel.findById(carritoId);
    } catch (error) {}
  }

  async getCarritoByUserId(userId) {
    try {
      let cart = await CarritoModel.findOne({ userId });
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCarrito(product, carritoId) {
    try {
      CarritoModel.findById(carritoId)
        .populate("products")
        .exec((err, carrito) => {
          if (err) throw err;
          carrito.products.push(product);
          carrito.save();
          return carrito;
        });
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
      if (!carrito) throw new Error("Carrito no encontrado");
      carrito.products = [];
      carrito.save();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CarritoMongoDAO;
