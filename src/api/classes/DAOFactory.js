let productoDao;
let carritoDao;

let instance = null;

class DAOFactory {
  useDAO(DAOType) {
    if (DAOType == "mongo") {
      const ProductosMongoDAO = require("../dao/products/ProductosMongoDAO.js");
      const CarritoMongoDAO = require("../dao/carrito/CarritoMongoDAO.js");

      return { CarritoMongoDAO, ProductosMongoDAO };
    }
  }

  static getInstance() {
    if (!instance) {
      instance = new MongoDBClient();
    }

    return instance;
  }
}

module.exports = DAOFactory;
