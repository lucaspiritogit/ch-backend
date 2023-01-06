const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const ProductService = require("../service/ProductService.js");
const routerGraphProductos = require("express").Router();

const productService = new ProductService();
async function getAllProductsGraph() {
  try {
    return await productService.getAllProducts();
  } catch (error) {
    throw error;
  }
}

const schema = buildSchema(`
  type Producto {
    title: String
    price: Float
    thumbnail: String
    code: String
    stock: Int
    description: String
  }
  
  type Query {
    getAllProductsGraph: [Producto]
  }
  `);

routerGraphProductos.use(
  "/",
  graphqlHTTP({
    schema: schema,
    rootValue: {
      getAllProductsGraph,
    },
    graphiql: false,
  })
);

module.exports = routerGraphProductos;
