const dotenv = require("dotenv");
const { Router } = require("express");
const { carritoDao, productoDao } = require("../dao/setDB.js");
const routerCarrito = Router();
dotenv.config();

// Crear un nuevo carrito
routerCarrito.post("/", async (req, res, next) => {
  let carrito = await carritoDao.createCarrito();
  res.json({ msg: `Carrito created`, carritoCreated: carrito });
});

// Obtener todos los carritos
routerCarrito.get("/", async (req, res, next) => {
  res.json(await carritoDao.getAll());
});

// Remover producto de carrito
routerCarrito.delete("/:idCarrito/productos/:idProducto", async (req, res, next) => {
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
});

// Agregar un producto a un carrito
routerCarrito.post("/:idCarrito/productos/:idProducto", async (req, res, next) => {
  try {
    await carritoDao.addProductToCarrito(req.params.idProducto, req.params.idCarrito);
    res.json({
      Producto: req.params.idProducto,
      "Agregado en carrito": req.params.idCarrito,
      "Visualizando carrito": await carritoDao.getById(req.params.idCarrito),
    });
  } catch (error) {
    res.send({ error: "Object not found" });
  }
});

// Eliminar un carrito
routerCarrito.delete("/:id", async (req, res, next) => {
  try {
    await carritoDao.deleteById(req.params.id);
    res.json({ "Carrito deleted": req.params.id });
  } catch (error) {
    res.send({ error: "Carrito not found" });
  }
});

module.exports = routerCarrito;
