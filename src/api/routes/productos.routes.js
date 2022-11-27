const dotenv = require("dotenv");
const { Router } = require("express");
const { carritoDao, productoDao } = require("../dao/setDB.js");
dotenv.config();
const routerProductos = Router();

let isAdmin = true;

function checkAdmin(req, res, next) {
  if (req.headers.authorization !== "Bearer admin") {
    isAdmin = false;
    res.json({
      error: "-1",
      descripcion: `ruta ${req.originalUrl} metodo ${req.method} no autorizada`,
    });
  } else {
    next();
  }
}
routerProductos.get("/:id", (req, res, next) => {
  try {
    res.send(productoDao.getById(parseInt(req.params.id)));
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerProductos.get("/", async (req, res, next) => {
  try {
    res.send(await productoDao.getAll());
  } catch (error) {
    res.send({ error: "No existen objetos" });
  }
});

routerProductos.post("/", checkAdmin, async (req, res) => {
  try {
    let producto = await productoDao.save(req.body);
    res.json({ "Producto creado:": producto });
  } catch (error) {
    throw error;
  }
});

routerProductos.get("/:id", async (req, res) => {
  try {
    let foundObject = await productoDao.getById(req.params.id);

    res.json(foundObject);
    return;
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerProductos.get("/", async (req, res, next) => {
  try {
    return await productoDao.getAll();
  } catch (error) {
    res.send({ error: "No existen objetos" });
  }
});

module.exports = routerProductos;
