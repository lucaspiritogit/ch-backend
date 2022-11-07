const ContainerFirebase = require("../../service/ContainerFirebase.js");

class ProductosFirebaseDao extends ContainerFirebase {
  constructor() {
    super("productos");
  }
}

module.exports = ProductosFirebaseDao;
