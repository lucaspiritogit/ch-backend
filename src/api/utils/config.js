const knex = require("knex")({
  client: "better-sqlite3",
  connection: {
    filename: "../db/mensajes.sqlite",
  },
});

