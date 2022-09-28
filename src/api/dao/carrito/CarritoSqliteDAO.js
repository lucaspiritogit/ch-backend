import knex from "knex";

class CarritoSqliteDAO {
  constructor(tableName, config) {
    this.knexCli = knex(config);
    this.tableName = tableName;
  }

  async findAll() {
    return await this.knexCli.from(this.tableName).select("*");
  }

  async find(id) {
    return await this.knexCli.from(this.tableName).select("*").where({ id: id });
  }

  async updateById(id, obj) {
    return await this.knexCli.from(this.tableName).select("*").where({ id: id }).update(obj);
  }

  async insert(obj) {
    return await this.knexCli.from(this.tableName).insert(obj);
  }

  async deleteById(id) {
    return await this.knexCli.from(this.tableName).where({ id: id }).del();
  }
}

export default CarritoSqliteDAO;