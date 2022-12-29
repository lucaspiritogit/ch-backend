class DAOFactory {
  useDAO(DAOType) {
    if (DAOType == "mongo") {
      const ProductosMongoDAO = require("../dao/products/ProductosMongoDAO.js");
      const CarritoMongoDAO = require("../dao/carrito/CarritoMongoDAO.js");

      return { CarritoMongoDAO, ProductosMongoDAO };
    }
  }
}

module.exports = DAOFactory;
