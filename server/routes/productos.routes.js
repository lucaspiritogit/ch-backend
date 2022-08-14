const express = require("express");
const app = express();
const routerProductos = express.Router();
const Container = require("../../src/Container");
const container = new Container("./db/productos.txt");

routerProductos.get("/", async (req, res, next) => {
  res.send(container.getAll());
});

routerProductos.get("/:id", (req, res, next) => {
  try {
    res.send(container.getById(req.params.id));
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerProductos.post("/", (req, res, next) => {
  let data = req.body;
  container.save(data);

  res.status(201).send(req.body);
});

routerProductos.put("/:id", (req, res, next) => {
  try {
    let data = req.body;

    let modifiedObj = {
      id: parseInt(req.params.id),
      title: data.title,
      price: data.price,
      thumbnail: data.thumbnail,
    };

    if (req.params.id == -1) {
      throw new Error("");
    }

    container.deleteById(req.params.id);
    container.save(modifiedObj);

    res.status(201).send(modifiedObj);
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerProductos.delete("/:id", (req, res, next) => {
  try {
    container.deleteById(req.params.id);
    res.send({ message: "Objeto eliminado" });
  } catch (error) {
    res.send({ message: "Objeto no encontrado" });
  }
});

module.exports = routerProductos;
