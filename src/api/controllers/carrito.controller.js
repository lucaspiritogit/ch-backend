const dotenv = require("dotenv");
const twilio = require("twilio");
const { Router } = require("express");
const Logger = require("../utils/logger.js");
const routerCarrito = Router();
const express = require("express");
const logger = new Logger();
dotenv.config();
const CarritoService = require("../service/CarritoService.js");
routerCarrito.use(express.static("./src/api/public"));

const carritoService = new CarritoService();

async function createCarrito(req, res) {
  try {
    let userId = req.user._id;
    let carrito = await carritoService.createCarrito(userId);
    res.json({ carrito });
  } catch (error) {
    logger.logError(error);
    res.redirect("/login");
  }
}

async function createOrder(req, res) {
  try {
    let userId = req.user._id;
    let userEmail = req.user.email;
    await carritoService.createOrder(userId, userEmail);
    res.json({ message: "Order created" });
  } catch (error) {
    throw error;
  }
}

async function getViewCarrito(req, res) {
  res.render("./cart.hbs");
}
// Products in the user's cart
async function getCarrito(req, res) {
  try {
    let userId = req.user._id;
    let carrito = await carritoService.getCarritoFromUser(userId);

    //res.render("./cart.hbs", { carrito });
    res.json({ carrito });
  } catch (error) {
    /*
      Usually this error will happen only on development
      since using nodemon refreshes the server, thus losing the user id in the process
    */
    logger.logError("Error when trying to retrieve cart data from userId");
    res.redirect("/loginError");
  }
}

async function getAllCarritos(req, res) {
  try {
    let allCarritos = await carritoService.getAllCarritos();
    res.send(allCarritos);
  } catch (error) {
    throw error;
  }
}

// Remover producto de carrito
async function removeProductFromCarrito(req, res) {
  try {
    let idProducto = req.params.idProducto;
    let idCarrito = req.params.idCarrito;

    await carritoService.removeProductFromCarrito(idProducto, idCarrito);
    res.json({
      Producto: req.params.idProducto,
      "Eliminado en Carrito": req.params.idCarrito,
    });
  } catch (error) {
    logger.logError(error);
    res.send({ Error: "Product not found in the selected cart" });
  }
}

// Agregar un producto a un carrito
async function addProductToCarrito(req, res) {
  try {
    let idProducto = req.params.idProducto;
    let idCarrito = req.params.idCarrito;

    await carritoService.addProductToCarrito(idProducto, idCarrito);
    res.json({
      "Agregado en carrito": req.params.idCarrito,
    });
  } catch (error) {
    res.send({ error: "Carrito not found" });
    throw error;
  }
}

async function deleteCarrito(req, res) {
  try {
    let carritoId = req.params.id;

    await carritoService.deleteCarrito(carritoId);
    res.json({ message: "Carrito deleted" });
  } catch (error) {
    res.send({ error: "Carrito not found" });
  }
}

module.exports = {
  createOrder,
  createCarrito,
  getAllCarritos,
  removeProductFromCarrito,
  addProductToCarrito,
  deleteCarrito,
  getCarrito,
  getViewCarrito,
};
