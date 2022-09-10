const path = require("path");
const config = {
  client: "better-sqlite3", // or 'better-sqlite3'
  connection: {
    filename: path.join(__dirname, "../db/mensajes.db3"),
  },
  useNullAsDefault: true,
};

module.exports = config;
