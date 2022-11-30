const dotenv = require("dotenv");
const { Router } = require("express");
const { carritoDao, productoDao } = require("../dao/setDB.js");
const routerCarrito = Router();
dotenv.config();

// Crear un nuevo carrito
routerCarrito.post("/", async (req, res, next) => {
  // Variable de sesion del usuario actual
  try {
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
});

// Obtener todos los carritos
routerCarrito.get("/", async (req, res, next) => {
  // Variable de sesion del usuario actual
  try {
    let userId = req.user._id;

    let carrito = await carritoDao.getCarritoByUserId(userId);
    if (!carrito) {
      let newCarrito = await carritoDao.createNewCarrito(userId);
      return res.json({ newCarrito });
    }
    return res.json({ "El carrito ya existe": carrito });
  } catch (error) {
    res.redirect("/login");
  }
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
