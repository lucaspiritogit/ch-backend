const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const CarritoService = require("../service/CarritoService.js");
const ProductService = require("../service/ProductService.js");
const routerGraphCarrito = require("express").Router();

const carritoService = new CarritoService();
const productService = new ProductService();

async function getAllCarritosGraph() {
  try {
    let allCarritos = await carritoService.getAllCarritos();

    return allCarritos;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getCarritoByIdGraph({ id }) {
  try {
    let carrito = await carritoService.getCarritoById(id);
    carrito.products.forEach(e => {
      const buffer = Buffer.from(e.id);
      e.id = buffer.toString("base64");
    });
    return carrito;
  } catch (error) {
    throw error;
  }
}

async function createCarritoGraph({ id }) {
  try {
    return await carritoService.createCarrito(id);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteCarritoGraph({ id }) {
  try {
    let deletedCarrito = await carritoService.deleteCarrito(id);
    return deletedCarrito;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const schema = buildSchema(`
type Producto {
  id: String
}

  type Carrito {
    id: String!
    timestamp: String
    products: [Producto]
    userId: String
  }
  
  type Query {
    getAllCarritosGraph: [Carrito],
    getCarritoByIdGraph(id: String!): Carrito
  }

  type Mutation {
    createCarritoGraph(id: String!): Carrito,
    deleteCarritoGraph(id: String!): Carrito

  }
  `);

routerGraphCarrito.use(
  "/",
  graphqlHTTP({
    schema: schema,
    rootValue: {
      getAllCarritosGraph,
      getCarritoByIdGraph,
      createCarritoGraph,
      deleteCarritoGraph,
    },
    graphiql: true,
  })
);

module.exports = routerGraphCarrito;
