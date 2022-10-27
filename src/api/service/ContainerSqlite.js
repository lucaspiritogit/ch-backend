import knex from "knex";
import config from "../../utils/config.js";

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

export default ContainerSqliteDAO;
