const ContainerArchivo = require('../../containers/ContainerArchivo.js');
const ProductosArchivoDAO = require('../products/ProductosArchivoDAO.js');
const productosArchivoDAO = new ProductosArchivoDAO();
class CarritoArchivoDAO extends ContainerArchivo {
  constructor() {
    super('./src/api/db/carrito.txt');
  }

  async addProductToCarrito(productId, carritoId) {
    try {
      let carrito = await this.getById(parseInt(carritoId));
      let product = await productosArchivoDAO.getById(parseInt(productId));
      carrito.products.push(product);
      await this.updateById(parseInt(carritoId), carrito);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CarritoArchivoDAO;
