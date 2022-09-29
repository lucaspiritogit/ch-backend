import * as dotenv from "dotenv";
import { Router } from "express";
import { carritoDao, productoDao } from "../dao/setDB.js";
const routerCarrito = Router();
dotenv.config();

routerCarrito.post("/", async (req, res, next) => {
  const time = new Date();

  let data = {
    timestamp: time.toLocaleDateString() + " " + time.toLocaleTimeString(),
    products: [],
  };
  await carritoDao.save(data);
  res.json({ msg: "Carrito created", contentCreated: data });
});

routerCarrito.get("/", async (req, res, next) => {
  res.json(await carritoDao.getAll());
});

routerCarrito.get("/:id/productos", async (req, res, next) => {
  try {
    let selectedCarrito = await carritoDao.getById(parseInt(req.params.id));

    if (process.env.DBTYPE == "mongo" || process.env.DBTYPE == "firebase") {
      selectedCarrito = await carritoDao.getById(req.params.id);
    }

    res.json(selectedCarrito);
  } catch (error) {
    throw error;
  }
});

routerCarrito.post("/:idCarrito/productos/:idProducto", async (req, res, next) => {
  try {
    let selectedProduct = await productoDao.getById(parseInt(req.params.idProducto));

    if (process.env.DBTYPE == "mongo" || process.env.DBTYPE == "firebase") {
      selectedProduct = await productoDao.getById(req.params.idProducto);
    }

    let selectedCarrito = await carritoDao.getById(parseInt(req.params.idCarrito));

    if (process.env.DBTYPE == "mongo" || process.env.DBTYPE == "firebase") {
      selectedCarrito = await carritoDao.getById(req.params.idCarrito);
    }
    selectedCarrito.products.push(selectedProduct);

    await carritoDao.save(selectedCarrito);

    res.json({ msg: `Added product ${req.params.idProducto} in carrito ${req.params.idCarrito}` });
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerCarrito.delete("/:id", async (req, res, next) => {
  try {
    await carritoDao.deleteById(parseInt(req.params.id));
    res.json({ msg: "Carrito deleted" });
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerCarrito.delete("/:idCarrito/productos/:idProducto", async (req, res, next) => {
  try {
    let selectedCarrito = await carritoDao.getById(parseInt(req.params.idCarrito));

    res.json({ msg: "Product deleted" });
  } catch (error) {
    throw error;
  }
});

export default routerCarrito;
