const knex = require("knex");
const config = require("../../utils/config.js");

const db = {
  client: "better-sqlite3", // or 'better-sqlite3'
  connection: {
    filename: "../../db/mensajes.sqlite",
  },
  useNullAsDefault: true,
};

class Repository {
  constructor(tableName) {
    this.knexCli = knex(config);
    this.tableName = tableName;
  }

  async findAll() {
    return await this.knexCli(this.tableName).select("*");
  }

  find() {}

  updateById(id, obj) {}

  async insert(obj) {
    return await this.knexCli(this.tableName).insert(obj);
  }

  deleteById(id) {}
}

module.exports = Repository;
