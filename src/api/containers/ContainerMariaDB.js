const knex = require("knex");
const dotenv = require("dotenv");
dotenv.config();
const configMariaDB = process.env.configMariaDB;

console.log("Connected with MariaDB");
class ContainerMariaDB {
  constructor(tableName, configMariaDB) {
    this.knexCli = knex(configMariaDB);
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

module.exports = ContainerMariaDB;
