import ContainerSqlite from "../../service/ContainerSqlite.js";
import configSQLite from "../../utils/configSQLite.js";

class CarritoSqliteDAO extends ContainerSqlite {
  constructor() {
    super("carritos", configSQLite);
  }
}

export default CarritoSqliteDAO;
