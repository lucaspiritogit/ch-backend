const dotenv = require("dotenv");
const twilio = require("twilio");
const { Router } = require("express");
const Logger = require("../utils/logger.js");
const { carritoDao, productoDao } = require("../dao/setDB.js");
const routerCarrito = Router();
const express = require("express");
const logger = new Logger();
dotenv.config();
const CarritoService = require("../service/CarritoService.js");
routerCarrito.use(express.static("./src/api/public"));

const client = new twilio(process.env.SSID, process.env.TWILIO_AUTH_TOKEN);
const carritoService = new CarritoService();
async function createOrder(req, res) {
  try {
    await carritoService.createOrder(req, res);
  } catch (error) {
    throw "Couldnt send twilio message";
  }
}
// Crear un nuevo carrito
async function createCarrito(req, res) {
  try {
    await carritoService.createCarrito(req, res);
  } catch (error) {
    res.redirect("/login");
  }
}

// Los productos del carrito del usuario
async function getCarritoFromUser(req, res) {
  try {
    await carritoService.getCarritoFromUser(req, res);
  } catch (error) {
    logger.logError("Error when trying to retrieve cart data from userId");
    res.redirect("/loginError");
  }
}

async function getAllCarritos(req, res) {
  try {
    await carritoService.getAllCarritos(req, res);
  } catch (error) {
    res.redirect("/login");
  }
}

// Remover producto de carrito
async function removeProductFromCarrito(req, res) {
  try {
    await carritoService.removeProductFromCarrito(req, res);
  } catch (error) {
    res.send({ Error: "Product not found in the selected cart" });
  }
}

// Agregar un producto a un carrito
async function addProductToCarrito(req, res) {
  try {
    await carritoService.addProductToCarrito(req, res);
  } catch (error) {
    res.send({ error: "Carrito not found" });
  }
}

async function deleteCarrito(req, res) {
  try {
    await carritoService.deleteCarrito(req, res);
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
};
