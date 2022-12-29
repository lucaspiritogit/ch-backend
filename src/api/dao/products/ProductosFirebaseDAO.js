const ContainerFirebase = require("../../containers/ContainerFirebase.js");

class ProductosFirebaseDao extends ContainerFirebase {
  constructor() {
    super("productos");
  }
}

module.exports = ProductosFirebaseDao;
