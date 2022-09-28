import * as dotenv from "dotenv";
dotenv.config();

let productoDao;
let carritoDao;

switch (process.env.DBTYPE) {
  case "text":
    const { default: ProductosArchivoDAO } = await import("./products/ProductosArchivoDAO.js");
    const { default: CarritoArchivoDAO } = await import("./carrito/CarritoArchivoDAO.js");

    productoDao = new ProductosArchivoDAO();
    carritoDao = new CarritoArchivoDAO();
    break;

  case "sqlite":
    const { default: CarritoSqliteDAO } = await import("./carrito/CarritoSqliteDAO.js");

    productoDao = new ProductosArchivoDAO();
    carritoDao = new CarritoSqliteDAO();

    break;
  case "mariadb":
    const { default: ProductosMariaDAO } = await import("./products/ProductosMariaDAO.js");

    productoDao = new ProductosMariaDAO();
    break;
  case "mongo":
    const { default: ProductosMongoDAO } = await import("./products/ProductosMongoDAO.js");
    productoDao = new ProductosMongoDAO();

    break;

  case "firebase":
    const { default: ProductosFirebaseDAO } = await import("./products/ProductosFirebaseDAO.js");
    const { default: CarritoFirebaseDAO } = await import("./carrito/CarritoFirebaseDAO.js");

    productoDao = new ProductosFirebaseDAO();
    carritoDao = new CarritoFirebaseDAO();
    break;
}

export { carritoDao, productoDao };
