import knex from "knex";
<<<<<<< HEAD:src/api/service/ContainerMariaDB.js
=======
import config from "../../utils/configMariaDB.js";
>>>>>>> clase24:src/api/public/js/RepositoryProduct.js

console.log("Connected with MariaDB");
class ContainerMariaDB {
  constructor(tableName, config) {
    this.knexCli = knex(config);
    this.tableName = tableName;
  }

  async getAll() {
    return await this.knexCli.from(this.tableName).select("*");
  }

  async getById(id) {
    return await this.knexCli.from(this.tableName).select("*").where({ id: id });
  }

  async updateById(id, obj) {
    return await this.knexCli.from(this.tableName).select("*").where({ id: id }).update(obj);
  }

  async save(obj) {
    return await this.knexCli.from(this.tableName).insert(obj);
  }

  async deleteById(id) {
    return await this.knexCli.from(this.tableName).where({ id: id }).del();
  }
}

<<<<<<< HEAD:src/api/service/ContainerMariaDB.js
export default ContainerMariaDB;
=======
export default RepositoryProducts;
>>>>>>> clase24:src/api/public/js/RepositoryProduct.js
