const express = require("express");
const app = express();
const path = require("path");
const routerCarrito = express.Router();
const fs = require("fs");

const Container = require("../service/Container.js");
const carritoContainer = new Container("./src/api/db/carrito.txt");
const productosContainer = new Container("./src/api/db/productos.txt");

app.use(express.static(path.join(__dirname, "./src/api/public")));

routerCarrito.post("/", (req, res, next) => {
  const time = new Date();

  let data = {
    timestamp: time.toLocaleDateString() + " " + time.toLocaleTimeString(),
    products: [],
  };

  carritoContainer.save(data);
  res.sendStatus(201);
});

routerCarrito.delete("/:id", (req, res, next) => {
  try {
    carritoContainer.deleteById(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerCarrito.get("/:id/productos", (req, res, next) => {
  let selectedCarrito = carritoContainer.getById(parseInt(req.params.id));

  res.json(selectedCarrito);
});

routerCarrito.post("/:idCarrito/productos/:idProducto", (req, res, next) => {
  try {
    let selectedProduct = productosContainer.getById(parseInt(req.params.idProducto));

    let readCarritoArray = JSON.parse(fs.readFileSync("./src/api/db/carrito.txt", "utf-8"));
    let selectedCarrito = readCarritoArray[req.params.idCarrito - 1].products;
    selectedCarrito.push(selectedProduct);

    fs.writeFileSync("./src/api/db/carrito.txt", JSON.stringify(readCarritoArray, null, 2));

    res.send(readCarritoArray).status(201);
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerCarrito.delete("/:id/productos/:id_prod", (req, res, next) => {
  try {
    let newProdArr = [];
    let selectedCarrito = carritoContainer.getById(parseInt(req.params.id));
    let selectedProductIndex = selectedCarrito.products.findIndex(
      prod => prod.id === parseInt(req.params.id_prod)
    );

    if (selectedProductIndex == -1) {
      return res.json({ error: "Producto no encontrado" });
    }

    selectedCarrito.products.splice(selectedProductIndex, 1);

    newProdArr.push(selectedCarrito);

    fs.writeFile("./src/api/db/carrito.txt", JSON.stringify(newProdArr, null, 2), err => {
      if (err) throw err;
    });

    res.sendStatus(201);
  } catch (error) {
    throw error;
  }
});

module.exports = routerCarrito;
