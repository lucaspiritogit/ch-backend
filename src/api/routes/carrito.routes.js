const express = require("express");
const app = express();
const path = require("path");
const routerCarrito = express.Router();
const fs = require("fs");

const CarritoArchivoDAO = require("../dao/carrito/CarritoArchivoDAO.js");
const carritoArchivoDAO = new CarritoArchivoDAO();

const ProductosArchivoDAO = require("../dao/products/ProductosArchivoDAO.js");
const productosArchivoDAO = new ProductosArchivoDAO();

app.use(express.static(path.join(__dirname, "./src/api/public")));

routerCarrito.post("/", (req, res, next) => {
  const time = new Date();

  let data = {
    timestamp: time.toLocaleDateString() + " " + time.toLocaleTimeString(),
    products: [],
  };

  carritoArchivoDAO.save(data);
  res.sendStatus(201);
});

routerCarrito.delete("/:id", (req, res, next) => {
  try {
    carritoArchivoDAO.deleteById(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerCarrito.get("/:id/productos", (req, res, next) => {
  let selectedCarrito = carritoArchivoDAO.getById(parseInt(req.params.id));

  res.json(selectedCarrito);
});

routerCarrito.post("/:idCarrito/productos/:idProducto", async (req, res, next) => {
  try {
    let selectedProduct = await productosArchivoDAO.getById(parseInt(req.params.idProducto));

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
    let selectedCarrito = carritoArchivoDAO.getById(parseInt(req.params.id));
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
