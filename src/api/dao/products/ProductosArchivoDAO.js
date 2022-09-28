import ContainerArchivo from "../../service/ContainerArchivo.js";

class ProductosArchivoDAO extends ContainerArchivo {
  constructor() {
    super("./src/api/db/productos.txt");
  }
}

export default ProductosArchivoDAO;
