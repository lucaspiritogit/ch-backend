import knex from "knex";
<<<<<<< HEAD:src/api/service/ContainerSqlite.js
=======
import config from "../../utils/config.js";
>>>>>>> clase24:src/api/public/js/Repository.js

class ContainerSqliteDAO {
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

<<<<<<< HEAD:src/api/service/ContainerSqlite.js
export default ContainerSqliteDAO;
=======
export default Repository;
>>>>>>> clase24:src/api/public/js/Repository.js
