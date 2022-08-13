const express = require("express");
const Container = require("../src/Container.js");
const routerProductos = require("./routes/productos.routes.js");

const PORT = 8080;
const app = express();
const container = new Container("./db/productos.txt");

// configs

app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});
// /api/productos
app.use("/api/productos", routerProductos);

app.get("/", (req, res) => {
  res.send("Test");
});

// glitch sv: https://glitch.com/edit/#!/oval-victorious-peridot?path=server%2Fapp.js%3A14%3A23
