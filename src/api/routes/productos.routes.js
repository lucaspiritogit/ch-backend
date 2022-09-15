const express = require("express");
const app = express();
const path = require("path");
const Container = require("../service/Container.js");
const routerProductos = express.Router();

const container = new Container("./src/api/db/productos.txt");
app.use(express.static(path.join(__dirname, "./src/api/public")));

const checkIfAdmin = (req, res, next) => {
  let isAdmin = true;
  if (req.headers.authorization !== "Bearer admin") {
    isAdmin = false;
    res.json({
      error: "-1",
      descripcion: `ruta ${req.originalUrl} metodo ${req.method} no autorizada`,
    });
  } else {
    next();
  }
};

routerProductos.get("/:id", (req, res) => {
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

routerProductos.post("/", checkIfAdmin, (req, res, next) => {
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
});

routerProductos.put("/:id", checkIfAdmin, (req, res, next) => {
  try {
    const time = new Date();
    let data = req.body;

    let originalObj = container.getById(parseInt(req.params.id));

    let modifiedObj = {
      timestamp: time.toLocaleDateString() + " " + time.toLocaleTimeString(),
      title: data.title,
      description: data.description,
      code: data.code,
      thumbnail: data.thumbnail,
      price: parseInt(data.price),
      stock: data.stock,
    };

    if (data.id == null) {
      modifiedObj.id = originalObj.id;
    }

    if (data.title == null) {
      modifiedObj.title = originalObj.title;
    }

    if (data.description == null) {
      modifiedObj.description = originalObj.description;
    }

    if (data.code == null) {
      modifiedObj.code = originalObj.code;
    }

    if (data.thumbnail == null) {
      modifiedObj.thumbnail = originalObj.thumbnail;
    }

    if (data.price == null) {
      modifiedObj.price = originalObj.price;
    }

    if (data.stock == null) {
      modifiedObj.stock = originalObj.stock;
    }

    container.deleteById(req.params.id);
    container.save(modifiedObj);

    res.status(201).send(modifiedObj);
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerProductos.delete("/:id", checkIfAdmin, (req, res, next) => {
  try {
    container.deleteById(req.params.id);
    res.send({ message: "Objeto eliminado" });
  } catch (error) {
    res.send({ message: "Objeto no encontrado" });
  }
});

module.exports = routerProductos;
