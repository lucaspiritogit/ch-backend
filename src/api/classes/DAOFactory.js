const minimist = require("minimist");
let options = { alias: { t: "dao" }, default: { t: "mongo" } };

let args = minimist(process.argv.slice(2), options);
class DAOFactory {
  useDAO() {
    let selectedDao = {};

    if (args.t == "firebase") {
      const ProductosFirebaseDAO = require("../dao/products/ProductosFirebaseDAO.js");
      const CarritoFirebaseDAO = require("../dao/carrito/CarritoFirebaseDAO.js");
      const productoDao = new ProductosFirebaseDAO();
      const carritoDao = new CarritoFirebaseDAO();
      selectedDao = { carritoDao, productoDao };
      return selectedDao;
    } else if (args.t == "text") {
      const ProductosArchivoDAO = require("../dao/products/ProductosArchivoDAO.js");
      const CarritoArchivoDAO = require("../dao/carrito/CarritoArchivoDAO.js");
      const productoDao = new ProductosArchivoDAO();
      const carritoDao = new CarritoArchivoDAO();
      selectedDao = { carritoDao, productoDao };
      return selectedDao;
    }

    const ProductosMongoDAO = require("../dao/products/ProductosMongoDAO.js");
    const CarritoMongoDAO = require("../dao/carrito/CarritoMongoDAO.js");
    const productoDao = new ProductosMongoDAO();
    const carritoDao = new CarritoMongoDAO();
    selectedDao = { carritoDao, productoDao };
    return selectedDao;
  }
}

module.exports = DAOFactory;
