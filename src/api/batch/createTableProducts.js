const knex = require("knex");
const config = require("../utils/configMariaDB.js");

const knexCli = knex(config);

knexCli.schema
  .createTable("productos", table => {
    table.increments("id").primary();
    table.string("title", 250);
    table.integer("price");
    table.string("timestamp", 50);
    table.string("code", 50);
    table.string("stock", 50);
    table.string("description", 250);
    table.string("thumbnail", 250);
  })
  .then(() => console.log("Tabla productos creada"))
  .catch(err => {
    throw err;
  })
  .finally(() => {
    knexCli.destroy();
  });
