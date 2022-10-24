import express, { Router } from "express";
const app = express();
const routerCarrito = Router();

import Container from "../service/Container.js";
const carritoContainer = new Container("./src/api/db/carrito.txt");
const productosContainer = new Container("./src/api/db/productos.txt");

routerCarrito.post("/", (req, res, next) => {
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
      const prodArray = selectedCarrito.products;

      const indexOfProduct = prodArray.findIndex(prod => prod._id == req.params.idProducto);
      prodArray.splice(indexOfProduct, 1);

      await carritoDao.save(selectedCarrito);
      res.json({ msg: "Product deleted" });
    } else if (process.env.DBTYPE == "firebase") {
      let selectedCarrito = await carritoDao.getById(req.params.idCarrito);
      await carritoDao.updateById(selectedCarrito.id, { products: {} });
      res.json({ msg: "Product deleted" });
    } else {
      const selectedCarrito = await carritoDao.getById(req.params.idCarrito);
      const prodArray = selectedCarrito.products;

      const indexOfProduct = prodArray.findIndex(prod => prod._id == req.params.idProducto);
      prodArray.splice(indexOfProduct, 1);

      await carritoDao.save(selectedCarrito);
      res.json({ msg: "Product deleted" });
    }
  } catch (error) {
    res.json({ msg: "Carrito or Product not found" });
  }
});

routerCarrito.post("/:idCarrito/productos/:idProducto", async (req, res, next) => {
  try {
<<<<<<< HEAD
    if (process.env.DBTYPE == "mongo") {
      let selectedCarrito = await carritoDao.getById(req.params.idCarrito);
      let selectedProduct = await productoDao.getById(req.params.idProducto);
      const prodArray = selectedCarrito.products;
      prodArray.push(selectedProduct);
      await carritoDao.save(selectedCarrito);
    } else if (process.env.DBTYPE == "firebase") {
      let selectedCarrito = await carritoDao.getById(req.params.idCarrito);
      let selectedProduct = await productoDao.getById(req.params.idProducto);
      const prodArray = selectedCarrito.products;
      prodArray.push(selectedProduct);
      await carritoDao.updateById(selectedCarrito);
    } else {
      let selectedCarrito = await carritoDao.getById(parseInt(req.params.idCarrito));
      let selectedProduct = await productoDao.getById(parseInt(req.params.idProducto));
      const prodArray = selectedCarrito.products;
      prodArray.push(selectedProduct);
      await carritoDao.save(selectedProduct);
    }

    res.json({ msg: `Added product ${req.params.idProducto} in carrito ${req.params.idCarrito}` });
=======
    let selectedProduct = productosContainer.getById(parseInt(req.params.id));

    let readCarritoArray = JSON.parse(readFileSync("./src/api/db/carrito.txt", "utf-8"));
    let products;

    for (let i = 0; i < readCarritoArray.length; i++) {
      const carrito = readCarritoArray[i];
      products = carrito.products;
    }

    products.push(selectedProduct);

    writeFileSync("./src/api/db/carrito.txt", JSON.stringify(readCarritoArray, null, 2));

    res.send(readCarritoArray).status(201);
>>>>>>> clase24
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

<<<<<<< HEAD
    res.json({ msg: "Carrito deleted" });
=======
    selectedCarrito.products.splice(selectedProductIndex, 1);

    newProdArr.push(selectedCarrito);

    writeFile("./src/api/db/carrito.txt", JSON.stringify(newProdArr, null, 2), err => {
      if (err) throw err;
    });

    res.send(201);
>>>>>>> clase24
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

<<<<<<< HEAD
routerCarrito.get("/:id/productos", async (req, res, next) => {
  try {
    let selectedCarrito = await carritoDao.getById(req.params.id);

    res.json(selectedCarrito);
  } catch (error) {
    res.json({ error: "Carrito not found" });
  }
});

=======
>>>>>>> clase24
export default routerCarrito;
