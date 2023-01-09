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

async function getProductByIdGraph({ id }) {
  try {
    return await productService.getProductById(id);
  } catch (error) {
    throw error;
  }
}

async function createProductGraph({ title, price, code, stock, description }) {
  try {
    let createdProduct = await productService.createProduct({
      title,
      price,
      code,
      stock,
      description,
    });
    return createdProduct;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateProductGraph({ id, title, price, code, stock, description }) {
  try {
    let updatedProduct = await productService.updateProductById(id, {
      title,
      price,
      code,
      stock,
      description,
    });

    if (!updatedProduct) return "Product not found";

    return updatedProduct;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteProductGraph({ id }) {
  try {
    let deletedProduct = await productService.deleteProductById(id);
    return deletedProduct;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const schema = buildSchema(`
  type Producto {
    id: String!
    title: String
    price: Float
    thumbnail: String
    code: String
    stock: Int
    description: String
  }
  
  type Query {
    getAllProductsGraph: [Producto],
    getProductByIdGraph(id: String!): Producto
  }

  type Mutation {
    createProductGraph(title: String!, price: Float!, code: String, stock: Int, description: String): Producto,
    deleteProductGraph(id: String!): Producto
    updateProductGraph(id: String!, title: String, price: Float, code: String, stock: Int, description: String): Producto

  }
  `);

routerGraphProductos.use(
  "/",
  graphqlHTTP({
    schema: schema,
    rootValue: {
      getAllProductsGraph,
      getProductByIdGraph,
      createProductGraph,
      deleteProductGraph,
      updateProductGraph,
    },
    graphiql: false,
  })
);

module.exports = routerGraphProductos;
