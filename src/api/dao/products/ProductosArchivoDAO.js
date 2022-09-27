const ContainerArchivo = require("../../service/ContainerArchivo");

class ProductosArchivoDAO extends ContainerArchivo {
  constructor() {
    super("./src/api/db/productos.txt");
  }
}

module.exports = ProductosArchivoDAO;
