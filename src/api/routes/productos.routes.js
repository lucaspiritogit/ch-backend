const dotenv = require("dotenv");
const { Router } = require("express");
const {
  getProductById,
  getAllProducts,
  createProduct,
  deleteProductById,
  updateProductById,
  deleteAllProducts,
} = require("../controllers/productos.controller.js");
dotenv.config();
const routerProductos = Router();

let isAdmin = true;

function checkAdmin(req, res, next) {
  if (req.headers.authorization !== "Bearer admin") {
    isAdmin = false;
    res.json({
      error: "-1",
      descripcion: `ruta ${req.originalUrl} metodo ${req.method} no autorizada`,
    });
  } else {
    next();
  }
}
routerProductos.get("/:id", getProductById);

routerProductos.get("/", getAllProducts);

routerProductos.post("/", checkAdmin, createProduct);

routerProductos.put("/:id", updateProductById);

routerProductos.delete("/:id", deleteProductById);

routerProductos.delete("/", deleteAllProducts);

module.exports = routerProductos;
