const dotenv = require("dotenv");
const { Router } = require("express");
const routerCarrito = Router();
const express = require("express");
const {
  createOrder,
  createCarrito,
  getCarrito,
  getAllCarritos,
  removeProductFromCarrito,
  addProductToCarrito,
  deleteCarrito,
  getCarritoView,
  deleteAllProductsFromCarrito,
} = require("../controllers/carrito.controller.js");

dotenv.config();

routerCarrito.use(express.static("./src/api/public"));

routerCarrito.post("/order", createOrder);

routerCarrito.post("/", createCarrito);

routerCarrito.post("/:idCarrito/productos/:idProducto", addProductToCarrito);

routerCarrito.get("/", getCarrito);

routerCarrito.get("/view", getCarritoView);

routerCarrito.get("/all", getAllCarritos);

routerCarrito.delete("/:idCarrito/productos/:idProducto", removeProductFromCarrito);

routerCarrito.delete("/:idCarrito/productos", deleteAllProductsFromCarrito);

routerCarrito.delete("/:id", deleteCarrito);

module.exports = routerCarrito;
