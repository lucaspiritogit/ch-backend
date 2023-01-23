const { log } = require('console');
const ContainerArchivo = require('../../containers/ContainerArchivo.js');
const ProductosArchivoDAO = require('../products/ProductosArchivoDAO.js');
const productosArchivoDAO = new ProductosArchivoDAO();
class CarritoArchivoDAO extends ContainerArchivo {
  constructor() {
    super('./src/api/db/carrito.txt');
  }

  async createNewCarritoWithoutUser() {
    try {
      let now = new Date();
      let date = now.getDate();
      let month = now.getMonth() + 1;
      let year = now.getFullYear();
      let hour = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();

      let timestamp = `${date}/${month}/${year} ${hour}:${minutes}:${seconds}`;
      let carrito = {
        timestamp: timestamp,
        products: [],
      };
      await this.save(carrito);
      return carrito;
    } catch (error) {
      throw error;
    }
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

  async removeProductFromCarrito(productId, carritoId) {
    try {
      let carrito = await this.getById(parseInt(carritoId));
      let product = carrito.products.filter(product => product.id == parseInt(productId));

      if (product.length > 0) {
        carrito.products = carrito.products.filter(product => product.id !== parseInt(productId));
        await this.updateById(parseInt(carritoId), carrito);
      } else {
        throw new Error('Producto no encontrado');
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CarritoArchivoDAO;
