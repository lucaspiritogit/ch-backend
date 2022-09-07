const express = require("express");
const app = express();
const path = require("path");
const Container = require("../service/Container.js");
const routerProductos = express.Router();

const container = new Container("./src/api/db/productos.txt");
app.use(express.static(path.join(__dirname, "./src/api/public")));

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
    const time = new Date();
    let data = req.body;
    data = {
      timestamp: time.toLocaleDateString() + " " + time.toLocaleTimeString(),
      title: data.title,
      description: data.description,
      code: data.code,
      thumbnail: data.thumbnail,
      price: parseInt(data.price),
      stock: data.stock,
    };
    container.save(data);

    res.send(data);
  }
});

routerProductos.put("/:id", (req, res, next) => {
  try {
    if (req.headers.authorization !== "Bearer admin") {
      isAdmin = false;
      res.send({
        error: "-1",
        descripcion: `ruta ${req.originalUrl} metodo ${req.method} no autorizada`,
      });
    } else {
      const time = new Date();
      let data = req.body;

      let modifiedObj = {
        timestamp: time.toLocaleDateString() + " " + time.toLocaleTimeString(),
        title: data.title,
        description: data.description,
        code: data.code,
        thumbnail: data.thumbnail,
        price: parseInt(data.price),
        stock: data.stock,
      };

      container.deleteById(req.params.id);
      container.save(modifiedObj);

      res.status(201).send(modifiedObj);
    }
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerProductos.delete("/:id", (req, res, next) => {
  try {
    if (req.headers.authorization !== "Bearer admin") {
      isAdmin = false;
      res.send({
        error: "-1",
        descripcion: `ruta ${req.originalUrl} metodo ${req.method} no autorizada`,
      });
    } else {
      container.deleteById(req.params.id);
      res.send({ message: "Objeto eliminado" });
    }
  } catch (error) {
    res.send({ message: "Objeto no encontrado" });
  }
});

module.exports = routerProductos;
