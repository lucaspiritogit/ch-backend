const dotenv = require('dotenv');
dotenv.config();

let productoDao;
let carritoDao;

switch (process.env.DBTYPE) {
  case 'text':
    const { default: ProductosArchivoDAO } = require('./products/ProductosArchivoDAO.js');
    const { default: CarritoArchivoDAO } = require('./carrito/CarritoArchivoDAO.js');

    productoDao = new ProductosArchivoDAO();
    carritoDao = new CarritoArchivoDAO();
    break;

  case 'mariadb':
    const { default: ProductosMariaDAO } = require('./products/ProductosMariaDAO.js');
    productoDao = new ProductosMariaDAO();
    break;

  case 'mongo':
    const ProductosMongoDAO = require('../dao/products/ProductosMongoDAO.js');
    const CarritoMongoDAO = require('../dao/carrito/CarritoMongoDAO.js');

    productoDao = new ProductosMongoDAO();
    carritoDao = new CarritoMongoDAO();
    break;

  case 'firebase':
    const ProductosFirebaseDAO = require('./products/ProductosFirebaseDAO.js');
    const CarritoFirebaseDAO = require('./carrito/CarritoFirebaseDAO.js');

    productoDao = new ProductosFirebaseDAO();
    carritoDao = new CarritoFirebaseDAO();
    break;

  default:
    console.error(
      "Se ingreso un parametro que no existe para conectarse a la base de datos, proba con 'mongo' o 'firebase'. De todas maneras, la aplicacion se levantara."
    );
}

module.exports = { carritoDao, productoDao };
