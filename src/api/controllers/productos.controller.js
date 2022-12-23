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
    res.status(201).json({ "Producto creado": createdProduct });
  } catch (error) {
    throw error;
  }
}

async function updateProductById(req, res) {
  try {
    let updatedProduct = await productService.updateProductById(req, res);
    res.status(201).json({ "Producto actualizado": updatedProduct });
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
}

async function deleteProductById(req, res) {
  try {
    await productService.deleteProductById(req, res);

    res.json({ "Producto eliminado": req.params.id });
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
}

module.exports = {
  getProductById,
  getAllProducts,
  createProduct,
  deleteProductById,
  updateProductById,
};
