const ProductService = require("../service/ProductService.js");

const productService = new ProductService();
async function getProductById(req, res) {
  try {
    res.send(await productService.getProductById(req, res));
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
}
async function getAllProducts(req, res, next) {
  try {
    res.send(await productService.getAllProducts());
  } catch (error) {
    res.send({ error: "No existen productos" });
  }
}

async function createProduct(req, res) {
  try {
    let createdProduct = await productService.createProduct(req.body);
    res.json({ "Producto creado": createdProduct });
  } catch (error) {
    throw error;
  }
}

module.exports = { getProductById, getAllProducts, createProduct };
