const { carritoDao, productoDao } = require("../dao/setDB.js");
const twilio = require("twilio");
const client = new twilio(process.env.SSID, process.env.TWILIO_AUTH_TOKEN);

class CarritoService {
  constructor() {}

  async createOrder(req, res) {
    let userId = req.user._id;
    if (userId == null) {
      throw new Error();
    }
    let carrito = await carritoDao.getCarritoByUserId(userId);

    let productsInCarrito = [];
    for (const product of carrito.products) {
      let products = await productoDao.getById(product._id);
      productsInCarrito.push(products);
    }

    return client.messages
      .create({
        from: "whatsapp:+14155238886",
        to: "whatsapp:+5491163788989",
        body: `Nuevo pedido recibido de ${req.user.email}. Productos: ${productsInCarrito}`,
      })
      .then(response => {
        res.send({ response });
      })
      .catch(e => {
        throw e;
      });
  }

  async createCarrito(req, res) {
    // Variable de sesion del usuario actual
    let userId = req.user._id;

    let carrito = await carritoDao.getCarritoByUserId(userId);
    if (!carrito) {
      let newCarrito = await carritoDao.createNewCarrito(userId);
      return res.json({ newCarrito });
    }
    return res.json({ carrito });
  }

  async getCarritoFromUser(req, res) {
    // Variable de sesion del usuario actual
    let userId = req.user._id;

    let carrito = await carritoDao.getCarritoByUserId(userId);

    if (!carrito) {
      let newCarrito = await carritoDao.createNewCarrito(userId);
      return res.json({ newCarrito });
    }

    let productsInCarrito = [];
    for (const product of carrito.products) {
      let products = await productoDao.getById(product._id);
      productsInCarrito.push(products);
    }

    return res.json({ productsInCarrito });
  }

  async getAllCarritos(req, res) {
    return res.render("./cart.hbs");
  }

  async removeProductFromCarrito(req, res) {
    await carritoDao.removeProductFromCarrito(req.params.idProducto, req.params.idCarrito);
    res.json({
      Producto: req.params.idProducto,
      "Eliminado en Carrito": req.params.idCarrito,
      "Visualizando carrito": await carritoDao.getById(req.params.idCarrito),
    });
  }

  async addProductToCarrito(req, res) {
    await carritoDao.addProductToCarrito(req.params.idProducto, req.params.idCarrito);
    let readCarrito = await carritoDao.getById(req.params.idCarrito);
    res.json({
      "Agregado en carrito": req.params.idCarrito,
      "Visualizando carrito": readCarrito,
    });
  }
  async deleteCarrito(req, res) {
    await carritoDao.deleteById(req.params.id);
    res.json({ "Carrito deleted": req.params.id });
  }
}

module.exports = CarritoService;