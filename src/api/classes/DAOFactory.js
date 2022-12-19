let productoDao;
let carritoDao;

class DAOFactory {
  useDAO(DAOType) {
    if (DAOType == "mongo") {
      const ProductosMongoDAO = require("../dao/products/ProductosMongoDAO.js");
      const CarritoMongoDAO = require("../dao/carrito/CarritoMongoDAO.js");

      productoDao = new ProductosMongoDAO();
      carritoDao = new CarritoMongoDAO();
    }
  }
}

module.exports = DAOFactory;
