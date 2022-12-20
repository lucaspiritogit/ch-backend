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

// Los productos del carrito del usuario
async function getCarritoFromUser(req, res) {
  try {
    let userId = req.user._id;
    let carrito = await carritoService.getCarritoFromUser(userId);
    res.json({ carrito });
  } catch (error) {
    logger.logError("Error when trying to retrieve cart data from userId");
    res.redirect("/loginError");
  }
}

async function getCarrito(req, res) {
  try {
    res.render("./cart.hbs");
  } catch (error) {
    throw error;
  }
}

async function getAllCarritos(req, res) {
  try {
    let allCarritos = await carritoService.getAllCarritos();
    console.log("🚀 ~ file: carrito.controller.js:59 ~ getAllCarritos ~ allCarritos", allCarritos);
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
    let readCarrito = await carritoDao.getById(idCarrito);

    await carritoService.addProductToCarrito(idProducto, idCarrito);
    res.json({
      "Agregado en carrito": req.params.idCarrito,
      "Visualizando carrito": readCarrito,
    });
  } catch (error) {
    res.send({ error: "Carrito not found" });
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
  getCarritoFromUser,
  getAllCarritos,
  removeProductFromCarrito,
  addProductToCarrito,
  deleteCarrito,
  getCarrito,
};
