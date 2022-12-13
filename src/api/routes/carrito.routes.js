const dotenv = require("dotenv");
const twilio = require("twilio");
const { Router } = require("express");
const Logger = require("../../../logs/logger.js");
const { carritoDao, productoDao } = require("../dao/setDB.js");
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
} = require("../controllers/carrito.controller.js");
routerCarrito.use(express.static("./src/api/public"));
dotenv.config();

routerCarrito.post("/order", createOrder);

routerCarrito.post("/", createCarrito);

routerCarrito.get("/usuario", getCarritoFromUser);

routerCarrito.get("/", getAllCarritos);

routerCarrito.delete("/:idCarrito/productos/:idProducto", removeProductFromCarrito);

routerCarrito.post("/:idCarrito/productos/:idProducto", addProductToCarrito);

routerCarrito.delete("/:id", deleteCarrito);

module.exports = routerCarrito;
