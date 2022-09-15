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

routerCarrito.post("/:id/productos", (req, res, next) => {
  try {
    let selectedProduct = productosContainer.getById(parseInt(req.params.id));

    let readCarritoArray = JSON.parse(fs.readFileSync("./src/api/db/carrito.txt", "utf-8"));
    let products;

    for (let i = 0; i < readCarritoArray.length; i++) {
      const carrito = readCarritoArray[i];
      products = carrito.products;
    }

    products.push(selectedProduct);

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

    selectedCarrito.products.splice(selectedProductIndex, 1);

    newProdArr.push(selectedCarrito);

    fs.writeFile("./src/api/db/carrito.txt", JSON.stringify(newProdArr, null, 2), err => {
      if (err) throw err;
    });

    res.send(201);
  } catch (error) {
    throw error;
  }
});

module.exports = routerCarrito;