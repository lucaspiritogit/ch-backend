const { carritoDao, productoDao } = require("../dao/setDB.js");
const ProductDTO = require("../dto/ProductDTO.js");
class ProductService {
  constructor() {}

  async getProductById(req, res) {
    let product = await productoDao.getById(req.params.id);
    const productDTO = new ProductDTO(
      product.id,
      product.title,
      product.price,
      product.description
    );

    return productDTO;
  }

  async getAllProducts() {
    let allProducts = await productoDao.getAll();

    let productsDTO = allProducts.map((product) => {
      const productDTO = new ProductDTO(
        product.id,
        product.title,
        product.price,
        product.description
      );
      return productDTO;
    });
    return productsDTO;
  }

  async createProduct(req, res) {
    return await productoDao.save(req.body);
  }

  async updateProductById(req, res) {
    try {
      return await productoDao.updateById(req.params.id, req.body);
    } catch (error) {
      throw error;
    }
  }

  async deleteProductById(req, res) {
    try {
      return await productoDao.deleteById(req.params.id);
    } catch {
      error;
    }
  }
}

module.exports = ProductService;
