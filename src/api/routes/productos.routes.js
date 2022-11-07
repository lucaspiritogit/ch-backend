const dotenv = require("dotenv");
const { Router } = require("express");
const { carritoDao, productoDao } = require("../dao/setDB.js");
dotenv.config();
const routerProductos = Router();

let isAdmin = true;
routerProductos.get("/:id", (req, res, next) => {
  try {
    res.send(container.getById(parseInt(req.params.id)));
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerProductos.get("/", (req, res, next) => {
  try {
    res.send(container.getAll());
  } catch (error) {
    res.send({ error: "No existen objetos" });
  }
});

routerProductos.post("/", (req, res, next) => {
  if (req.headers.authorization !== "Bearer admin") {
    isAdmin = false;
    res.json({
      error: "-1",
      descripcion: `ruta ${req.originalUrl} metodo ${req.method} no autorizada`,
    });
  } else {
    next();
  }
});

routerProductos.get("/:id", async (req, res) => {
  try {
    if (process.env.DBTYPE == "mongo" || process.env.DBTYPE == "firebase") {
      let foundObject = await productoDao.getById(req.params.id);

      res.json(foundObject);
      return;
    } else {
      let foundObject = await productoDao.getById(parseInt(req.params.id));

      if (foundObject == 0) {
        throw error;
      }
      res.send(foundObject);
    }
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

module.exports = routerProductos;
