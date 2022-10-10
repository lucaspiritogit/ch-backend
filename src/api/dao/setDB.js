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

  case "mariadb":
    const { default: ProductosMariaDAO } = await import("./products/ProductosMariaDAO.js");
    productoDao = new ProductosMariaDAO();
    break;

  case "mongo":
    const { default: ProductosMongoDAO } = await import("./products/ProductosMongoDAO.js");
    const { default: CarritoMongoDAO } = await import("./carrito/CarritoMongoDAO.js");

    productoDao = new ProductosMongoDAO();
    carritoDao = new CarritoMongoDAO();
    break;

  case "firebase":
    const { default: ProductosFirebaseDAO } = await import("./products/ProductosFirebaseDAO.js");
    const { default: CarritoFirebaseDAO } = await import("./carrito/CarritoFirebaseDAO.js");

    productoDao = new ProductosFirebaseDAO();
    carritoDao = new CarritoFirebaseDAO();
    break;
}

export { carritoDao, productoDao };
