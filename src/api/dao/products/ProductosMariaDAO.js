import ContainerMariaDB from "../../service/ContainerMariaDB.js";
import configMariaDB from "../../utils/configMariaDB.js";
class ProductosMariaDAO extends ContainerMariaDB {
  constructor() {
    super("productos", configMariaDB);
  }
}

export default ProductosMariaDAO;
