const ContainerSqlite = require("../../service/ContainerSqlite.js");
const configSQLite = require("../../utils/configSQLite.js");

class CarritoSqliteDAO extends ContainerSqlite {
  constructor() {
    super("carritos", configSQLite);
  }
}

module.exports = CarritoSqliteDAO;
