const Logger = require('../utils/logger.js');
const logger = new Logger();
const twilio = require('twilio');
const client = new twilio(process.env.SSID, process.env.TWILIO_AUTH_TOKEN);
const DAOFactory = require('../classes/DAOFactory.js');
const daoFactory = new DAOFactory();
const productoDao = daoFactory.useDAO().productoDao;
const carritoDao = daoFactory.useDAO().carritoDao;

class CarritoService {
  /**
   * This method only exists for the purpose of testing the application.
   * I defined that a cart needs a userId to be usable, but to be able to test
   * the application at its fullest, i think this would be useful too.
   * @returns {Object} Carrito
   */
  async createCarritoWithoutUser() {
    try {
      let newCarrito = await carritoDao.createNewCarritoWithoutUser();
      return newCarrito;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new cart, otherwise returns the existing cart
   * @param {number} userId
   * @returns {Object} Carrito
   */
  async createCarrito(userId) {
    try {
      let carrito = await carritoDao.getCarritoByUserId(userId);
      if (!carrito) {
        let newCarrito = await carritoDao.createNewCarrito(userId);
        return newCarrito;
      }
      return carrito;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new purchase order and sends it to the administrator via whatsapp
   * @param {Object} userId
   * @param {String} userEmail
   * @returns {Object} response
   */
  async createOrder(userId, userEmail) {
    if (userId == null) {
      throw new Error();
    }
    let carrito = await carritoDao.getCarritoByUserId(userId);

    let productsInCarrito = [];
    for (const product of carrito.products) {
      let products = await productoDao.getById(product._id);
      productsInCarrito.push(products);
    }

    return client.messages
      .create({
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+5491163788989',
        body: `Nuevo pedido recibido de ${userEmail}. Productos: ${productsInCarrito}`,
      })
      .then(response => {
        return response;
      })
      .catch(error => {
        throw error;
      });
  }

  /**
   * Return a list of products from a cart by user id
   * @constructor
   * @param {string} userId
   */
  async getProductsInCarritoFromUserId(userId) {
    try {
      let carrito = await carritoDao.getCarritoByUserId(userId);

      let productsInCarrito = [];

      for (const product of carrito.products) {
        let products = await productoDao.getById(product._id);
        productsInCarrito.push(products);
      }

      return productsInCarrito;
    } catch (error) {
      throw error;
    }
  }

  async getAllCarritos() {
    return await carritoDao.getAll();
  }

  async removeProductFromCarrito(idProducto, idCarrito) {
    await carritoDao.removeProductFromCarrito(idProducto, idCarrito);
  }

  async deleteAllProductsFromCarrito(idCarrito) {
    await carritoDao.deleteAllProductsFromCarrito(idCarrito);
  }

  async addProductToCarrito(idProducto, idCarrito) {
    await carritoDao.addProductToCarrito(idProducto, idCarrito);
  }

  async deleteCarrito(carritoId) {
    await carritoDao.deleteById(carritoId);
  }
}

module.exports = CarritoService;
