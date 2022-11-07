const ContainerMariaDB = require("../../service/ContainerMariaDB.js");
const configMariaDB = require("../../utils/configMariaDB.js");
class ProductosMariaDAO extends ContainerMariaDB {
  constructor() {
    super("productos", configMariaDB);
  }
}

module.exports = ProductosMariaDAO;
