const ContainerArchivo = require( "../../service/ContainerArchivo.js");

class ProductosArchivoDAO extends ContainerArchivo {
  constructor() {
    super("./src/api/db/productos.txt");
  }
}

module.exports = ProductosArchivoDAO;
