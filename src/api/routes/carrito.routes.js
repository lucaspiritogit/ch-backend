const dotenv = require("dotenv");
const { Router } = require("express");
const Logger = require("../utils/logger.js");
const routerCarrito = Router();
const express = require("express");
const logger = new Logger();
const {
  createOrder,
  createCarrito,
  getCarritoFromUser,
  getAllCarritos,
  removeProductFromCarrito,
  addProductToCarrito,
  deleteCarrito,
  getCarrito,
} = require("../controllers/carrito.controller.js");
dotenv.config();

routerCarrito.use(express.static("./src/api/public"));

routerCarrito.post("/order", createOrder);

routerCarrito.post("/", createCarrito);

routerCarrito.get("/usuario/:idUsuario", getCarritoFromUser);

routerCarrito.get("/", getCarrito);

routerCarrito.get("/all", getAllCarritos);

routerCarrito.delete("/:idCarrito/productos/:idProducto", removeProductFromCarrito);

routerCarrito.post("/:idCarrito/productos/:idProducto", addProductToCarrito);

routerCarrito.delete("/:id", deleteCarrito);

module.exports = routerCarrito;
