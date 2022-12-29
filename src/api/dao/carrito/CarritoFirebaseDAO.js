const ContainerFirebase = require("../../containers/ContainerFirebase.js");

class CarritoFirebaseDAO extends ContainerFirebase {
  constructor() {
    super("carrito");
  }
}

module.exports = CarritoFirebaseDAO;
