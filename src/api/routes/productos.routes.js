const express = require("express");
const app = express();
const path = require("path");
const routerProductos = express.Router();
const configMariaDB = require("../utils/configMariaDB");

const DAO = require("../dao/products/ProductosMariaDAO.js");
const prodDAO = new DAO("productos", configMariaDB);

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

routerProductos.get("/:id", async (req, res) => {
  try {
    let foundObject = await prodDAO.find(req.params.id);

    if (foundObject == 0) {
      throw error;
    }

    res.send(foundObject);
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerProductos.get("/", async (req, res, next) => {
  try {
    res.send(await prodDAO.findAll());
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
  prodDAO.insert(data);

  res.send(data);
});

routerProductos.put("/:id", checkIfAdmin, async (req, res, next) => {
  try {
    const time = new Date();
    let data = req.body;

    let foundObject = await prodDAO.find(req.params.id);
    let idOfFoundObject = foundObject[0].id;

    let modifiedObj = {
      id: data.id,
      timestamp: time.toLocaleDateString() + " " + time.toLocaleTimeString(),
      title: data.title,
      description: data.description,
      code: data.code,
      thumbnail: data.thumbnail,
      price: data.price,
      stock: data.stock,
    };

    prodDAO.updateById(idOfFoundObject, modifiedObj);

    res.status(201).send({
      msg: "Product updated",
      previousObject: foundObject[0],
      newObject: modifiedObj,
    });
  } catch (error) {
    res.send({ error: "Product not found" }).status(404);
  }
});

routerProductos.delete("/:id", checkIfAdmin, async (req, res, next) => {
  try {
    let deletedObject = await prodDAO.deleteById(req.params.id);

    if (!deletedObject) {
      throw error;
    }

    res.send({ message: "Objeto eliminado" });
  } catch (error) {
    res.send({ message: "Objeto no encontrado" });
  }
});

module.exports = routerProductos;
