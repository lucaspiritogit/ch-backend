const ProductDTO = require("../dto/ProductDTO.js");
const DAOFactory = require("../classes/DAOFactory.js");
const daoFactory = new DAOFactory();
const productoDao = daoFactory.useDAO().productoDao;

class ProductService {
  constructor() {}

  async getProductById(productId) {
    let product = await productoDao.getById(productId);
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

    let productsDTO = allProducts.map(product => {
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

  async createProduct(product) {
    console.log(product);
    return await productoDao.save(product);
  }

  async updateProductById(productId, obj) {
    try {
      return await productoDao.updateById(productId, obj);
    } catch (error) {
      throw error;
    }
  }

  async deleteProductById(productId) {
    try {
      return await productoDao.deleteById(productId);
    } catch {
      error;
    }
  }
}

module.exports = ProductService;
