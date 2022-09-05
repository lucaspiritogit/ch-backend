const express = require("express");
const app = express();
const path = require("path");
const Container = require("../service/Container.js");
const routerCarrito = express.Router();

const carritoContainer = new Container("./src/api/db/carrito.txt");
const productosContainer = new Container("./src/api/db/productos.txt");

app.use(express.static(path.join(__dirname, "./src/api/public")));

console.log(...[productosContainer.getAll()]);
routerCarrito.post("/", (req, res, next) => {
  let data = req.body;

  data = {
    products: {
      ...[productosContainer.getAll()],
    },
  };

  console.log();

  carritoContainer.save(data);
  res.redirect("/");
});

routerCarrito.delete("/:id", (req, res, next) => {});

routerCarrito.get("/:id/productos", (req, res, next) => {});

routerCarrito.post("/:id/productos", (req, res, next) => {});

routerCarrito.delete("/:id/productos/:id_prod", (req, res, next) => {});

module.exports = routerCarrito;
