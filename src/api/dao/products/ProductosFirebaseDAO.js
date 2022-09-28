import ContainerFirebase from "../../service/ContainerFirebase.js";

class ProductosFirebaseDao extends ContainerFirebase {
  constructor() {
    super("productos");
  }
}

export default ProductosFirebaseDao;
