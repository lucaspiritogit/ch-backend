const { productoDao } = require("../dao/setDB.js");

class ProductService {
  constructor() {}

  async getProductById(req, res) {
    return await productoDao.getById(req.params.id);
  }

  async getAllProducts(req, res) {
    return await productoDao.getAll();
  }

  async createProduct(req, res) {
    return await productoDao.save(req.body);
  }
}

module.exports = ProductService;
