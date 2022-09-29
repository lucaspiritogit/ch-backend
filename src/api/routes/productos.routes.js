import * as dotenv from "dotenv";
import { Router } from "express";
import { productoDao } from "../dao/setDB.js";
const routerProductos = Router();
dotenv.config();

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
    let foundObject = await productoDao.getById(parseInt(req.params.id));

    if (process.env.DBTYPE == "mongo" || process.env.DBTYPE == "firebase") {
      foundObject = await productoDao.getById(req.params.id);
    }

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
    res.send(await productoDao.getAll());
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
  productoDao.save(data);

  res.send(data);
});

routerProductos.put("/:id", checkIfAdmin, async (req, res, next) => {
  try {
    const time = new Date();
    let requestBody = req.body;

    let originalObj = await productoDao.getById(parseInt(req.params.id));

    if (process.env.DBTYPE == "mongo" || process.env.DBTYPE == "firebase") {
      originalObj = await productoDao.getById(req.params.id);
    }

    let modifiedObj = {
      id: requestBody.id,
      timestamp: time.toLocaleDateString() + " " + time.toLocaleTimeString(),
      title: requestBody.title,
      description: requestBody.description,
      code: requestBody.code,
      thumbnail: requestBody.thumbnail,
      price: requestBody.price,
      stock: requestBody.stock,
    };

    if (requestBody.id == null) {
      modifiedObj.id = originalObj.id;
    }

    if (requestBody.title == null) {
      modifiedObj.title = originalObj.title;
    }

    if (requestBody.description == null) {
      modifiedObj.description = originalObj.description;
    }

    if (requestBody.code == null) {
      modifiedObj.code = originalObj.code;
    }

    if (requestBody.thumbnail == null) {
      modifiedObj.thumbnail = originalObj.thumbnail;
    }

    if (requestBody.price == null) {
      modifiedObj.price = originalObj.price;
    }

    if (requestBody.stock == null) {
      modifiedObj.stock = originalObj.stock;
    }

    productoDao.updateById(parseInt(req.params.id), modifiedObj);

    if (process.env.DBTYPE == "mongo" || process.env.DBTYPE == "firebase") {
      productoDao.updateById(req.params.id, modifiedObj);
    }

    res.status(201).send({
      msg: "Product updated",
      oldProduct: originalObj,
      newProduct: modifiedObj,
    });
  } catch (error) {
    res.send({ error: "Product not found" }).status(404);
  }
});

routerProductos.delete("/:id", checkIfAdmin, async (req, res, next) => {
  try {
    let deletedObject = await productoDao.deleteById(parseInt(req.params.id));

    if (process.env.DBTYPE == "mongo" || process.env.DBTYPE == "firebase") {
      deletedObject = await productoDao.getById(req.params.id);
    }

    if (!deletedObject) {
      throw error;
    }

    res.send({ message: "Product deleted" });
  } catch (error) {
    res.send({ message: "Product not found" });
  }
});

export default routerProductos;
