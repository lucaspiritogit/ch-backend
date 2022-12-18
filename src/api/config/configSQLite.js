const config = {
  client: "better-sqlite3",
  connection: {
    filename: "./src/api/db/carritos.db3",
  },
  useNullAsDefault: true,
};

module.exports = config;
