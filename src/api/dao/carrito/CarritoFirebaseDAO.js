const ContainerFirebase = require("../../service/ContainerFirebase.js");

class CarritoFirebaseDAO extends ContainerFirebase {
  constructor() {
    super("carrito");
  }
}

module.exports = CarritoFirebaseDAO;
