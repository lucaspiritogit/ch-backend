const path = require("path");
const config = {
  client: "sqlite",
  connection: {
    filename: path.join(__dirname, "../db/mensajes.db3"),
  },
  useNullAsDefault: true,
};

module.exports = config;
