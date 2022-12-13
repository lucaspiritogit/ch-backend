const dotenv = require("dotenv");
const twilio = require("twilio");
const { Router } = require("express");
const Logger = require("../../../logs/logger.js");
const { carritoDao, productoDao } = require("../dao/setDB.js");
const routerCarrito = Router();
const express = require("express");
const logger = new Logger();
routerCarrito.use(express.static("./src/api/public"));
dotenv.config();

const client = new twilio(process.env.SSID, process.env.TWILIO_AUTH_TOKEN);
async function createOrder(req, res) {
  try {
    let userId = req.user._id;
    if (userId == null) {
      throw new Error();
    }
    let carrito = await carritoDao.getCarritoByUserId(userId);

    let productsInCarrito = [];
    for (const product of carrito.products) {
      let products = await productoDao.getById(product._id);
      productsInCarrito.push(products);
    }

    return client.messages
      .create({
        from: "whatsapp:+14155238886",
        to: "whatsapp:+5491163788989",
        body: `Nuevo pedido recibido de ${req.user.email}. Productos: ${productsInCarrito}`,
      })
      .then(response => {
        res.send({ response });
      })
      .catch(e => {
        throw e;
      });
  } catch (error) {
    throw "Couldnt send twilio message";
  }
}
// Crear un nuevo carrito
async function createCarrito(req, res) {
  try {
    // Variable de sesion del usuario actual
    let userId = req.user._id;

    let carrito = await carritoDao.getCarritoByUserId(userId);
    if (!carrito) {
      let newCarrito = await carritoDao.createNewCarrito(userId);
      return res.json({ newCarrito });
    }
    return res.json({ carrito });
  } catch (error) {
    res.redirect("/login");
  }
}

// Los productos del carrito del usuario
async function getCarritoFromUser(req, res) {
  try {
    // Variable de sesion del usuario actual
    let userId = req.user._id;

    let carrito = await carritoDao.getCarritoByUserId(userId);

    if (!carrito) {
      let newCarrito = await carritoDao.createNewCarrito(userId);
      return res.json({ newCarrito });
    }

    let productsInCarrito = [];
    for (const product of carrito.products) {
      let products = await productoDao.getById(product._id);
      productsInCarrito.push(products);
    }

    return res.json({ productsInCarrito });
  } catch (error) {
    logger.logError("Error when trying to retrieve cart data from userId");
    res.redirect("/loginError");
  }
}

async function getAllCarritos(req, res) {
  try {
    return res.render("./cart.hbs");
  } catch (error) {
    res.redirect("/login");
  }
}

// Remover producto de carrito
async function removeProductFromCarrito(req, res) {
  try {
    await carritoDao.removeProductFromCarrito(req.params.idProducto, req.params.idCarrito);
    res.json({
      Producto: req.params.idProducto,
      "Eliminado en Carrito": req.params.idCarrito,
      "Visualizando carrito": await carritoDao.getById(req.params.idCarrito),
    });
  } catch (error) {
    throw error;
  }
}

// Agregar un producto a un carrito
async function addProductToCarrito(req, res) {
  try {
    await carritoDao.addProductToCarrito(req.params.idProducto, req.params.idCarrito);
    let readCarrito = await carritoDao.getById(req.params.idCarrito);
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
    await carritoDao.deleteById(req.params.id);
    res.json({ "Carrito deleted": req.params.id });
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
