import ContainerArchivo from "../../service/ContainerArchivo.js";

class CarritoArchivoDAO extends ContainerArchivo {
  constructor() {
    super("./src/api/db/carrito.txt");
  }
}

export default CarritoArchivoDAO;
