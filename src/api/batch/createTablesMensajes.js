const knex = require("knex");
const config = require("../utils/config.js");

const knexCli = knex(config);

knexCli.schema
  .createTable("mensajes", table => {
    table.increments("id").primary();
    table.string("usuario", 250).notNullable;
    table.string("mensaje", 250);
    table.string("timestamp", 50);
  })
  .then(() => console.log("Tabla creada"))
  .catch(err => {
    throw err;
  })
  .finally(() => {
    knexCli.destroy();
  });
