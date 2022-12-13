const dotenv = require("dotenv");
const { Router } = require("express");
const { carritoDao, productoDao } = require("../dao/setDB.js");
dotenv.config();
const routerProductos = Router();

async function getProductById(req, res, next) {
  try {
    res.send(await productoDao.getById(req.params.id));
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
}
async function getAllProducts(req, res, next) {
  try {
    res.send(await productoDao.getAll());
  } catch (error) {
    res.send({ error: "No existen productos" });
  }
}

async function createProduct(req, res) {
  try {
    let producto = await productoDao.save(req.body);
    res.json({ "Producto creado:": producto });
  } catch (error) {
    throw error;
  }
}

module.exports = { getProductById, getAllProducts, createProduct };
