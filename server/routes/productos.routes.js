const express = require("express");
const app = express();
const routerProductos = express.Router();
const Container = require("../../src/Container");
const container = new Container("./db/productos.txt");

routerProductos.get("/", async (req, res, next) => {
  res.send(await container.getAll());
});

routerProductos.get("/:id", (req, res, next) => {
  res.send(container.getById(req.params.id));
});

routerProductos.post("/", (req, res, next) => {
  let data = req.body;
  container.save(data);

  res.status(201).send(data);
});

routerProductos.put("/:id", (req, res, next) => {
  let data = req.body;
  container.save(data);

  res.status(201).send(data);
});

routerProductos.delete("/:id", (req, res, next) => {
  if (res.status(500)) {
    res.send({ error: "Objeto no encontrado" });
  }

  container.deleteById(req.params.id);
});

module.exports = routerProductos;
