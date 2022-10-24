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

    selectedCarrito.products.splice(selectedProductIndex, 1);

    newProdArr.push(selectedCarrito);

    writeFile("./src/api/db/carrito.txt", JSON.stringify(newProdArr, null, 2), err => {
      if (err) throw err;
    });

    res.send(201);
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

export default routerCarrito;
