const ContainerArchivo = require("../../service/ContainerArchivo.js");

class CarritoArchivoDAO extends ContainerArchivo {
  constructor() {
    super("./src/api/db/carrito.txt");
  }
}

module.exports = CarritoArchivoDAO;
