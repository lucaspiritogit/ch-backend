import * as dotenv from "dotenv";
import { Router } from "express";
import { writeFile } from "fs";
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
routerCarrito.delete("/:id", async (req, res, next) => {
  try {
    await carritoDao.deleteById(req.params.id);
    res.json({ msg: "Carrito deleted" });
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerCarrito.get("/", async (req, res, next) => {
  res.json(await carritoDao.getAll());
});

routerCarrito.get("/:id/productos", async (req, res, next) => {
  let selectedCarrito = await carritoDao.getById(req.params.id);

  res.json(selectedCarrito);
});

routerCarrito.post("/:idCarrito/productos/:idProducto", async (req, res, next) => {
  try {
    let selectedProduct = await productoDao.getById(parseInt(req.params.idProducto));

    // let readCarritoArray = JSON.parse(readFileSync("./src/api/db/carrito.txt", "utf-8"));
    // let readCarritoArray = await carritoDao.getById(req.params.idCarrito);
    // let selectedCarrito = readCarritoArray[req.params.idCarrito - 1].products;
    let selectedCarrito = await carritoDao.getById(parseInt(req.params.idCarrito));
    selectedCarrito.push(selectedProduct);

    carritoDao.save(selectedCarrito);

    res.send(selectedCarrito).status(201);
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerCarrito.delete("/:id/productos/:id_prod", (req, res, next) => {
  try {
    let newProdArr = [];
    let selectedCarrito = carritoArchivoDAO.getById(parseInt(req.params.id));
    let selectedProductIndex = selectedCarrito.products.findIndex(
      prod => prod.id === parseInt(req.params.id_prod)
    );

    if (selectedProductIndex == -1) {
      return res.json({ error: "Producto no encontrado" });
    }

    selectedCarrito.products.splice(selectedProductIndex, 1);

    newProdArr.push(selectedCarrito);

    writeFile("./src/api/db/carrito.txt", JSON.stringify(newProdArr, null, 2), err => {
      if (err) throw err;
    });

    res.sendStatus(201);
  } catch (error) {
    throw error;
  }
});

export default routerCarrito;
