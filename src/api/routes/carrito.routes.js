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
  res.json({ msg: `Carrito created`, contentCreated: data });
});

routerCarrito.get("/", async (req, res, next) => {
  res.json(await carritoDao.getAll());
});

routerCarrito.delete("/:idCarrito/productos/:idProducto", async (req, res, next) => {
  try {
    if (process.env.DBTYPE == "mongo") {
      const selectedCarrito = await carritoDao.getById(req.params.idCarrito);
      const indexOfSelectedProduct = selectedCarrito.products.findIndex(
        p => p.id == req.params.idProducto
      );
      console.log(indexOfSelectedProduct);
      selectedCarrito.products.splice(indexOfSelectedProduct, 1);
      await carritoDao.updateById(selectedCarrito, req.params.idCarrito);
    } else if (process.env.DBTYPE == "firebase") {
      let selectedCarrito = await carritoDao.getById(req.params.idCarrito);
      await carritoDao.updateById(selectedCarrito.id, { products: {} });
    } else {
    }
    let selectedCarrito = await carritoDao.getById(parseInt(req.params.idCarrito));

    res.json({ msg: "Product deleted" });
  } catch (error) {
    res.json({ msg: "Carrito or Product not found" });
  }
});

routerCarrito.post("/:idCarrito/productos/:idProducto", async (req, res, next) => {
  try {
    if (process.env.DBTYPE == "mongo") {
      let selectedCarrito = await carritoDao.getById(req.params.idCarrito);
      let selectedProduct = await productoDao.getById(req.params.idProducto);
      const prodArray = selectedCarrito.products;
      prodArray.push(selectedProduct);
      await carritoDao.save(selectedCarrito);
    } else if (process.env.DBTYPE == "firebase") {
      let selectedCarrito = await carritoDao.getById(req.params.idCarrito);
      let selectedProduct = await productoDao.getById(req.params.idProducto);
      const prodArray = [];
      prodArray.push(selectedProduct);
      await carritoDao.updateById(selectedCarrito.id, { products: prodArray });
    } else {
      let selectedCarrito = await carritoDao.getById(parseInt(req.params.idCarrito));
      let selectedProduct = await productoDao.getById(parseInt(req.params.idProducto));
      const prodArray = selectedCarrito.products;
      prodArray.push(selectedProduct);
      await carritoDao.save(selectedProduct);
    }

    res.json({ msg: `Added product ${req.params.idProducto} in carrito ${req.params.idCarrito}` });
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerCarrito.delete("/:id", async (req, res, next) => {
  try {
    if (process.env.DBTYPE == "mongo" || process.env.DBTYPE == "firebase") {
      await carritoDao.deleteById(req.params.id);
    } else {
      await carritoDao.deleteById(parseInt(req.params.id));
    }

    res.json({ msg: "Carrito deleted" });
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerCarrito.get("/:id/productos", async (req, res, next) => {
  try {
    let selectedCarrito = await carritoDao.getById(req.params.id);

    res.json(selectedCarrito);
  } catch (error) {
    res.json({ error: "Carrito not found" });
  }
});

export default routerCarrito;
