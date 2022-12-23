const axios = require("axios");
const assert = require("assert").strict;
const ProductService = require("../api/service/ProductService.js");
const url = "http://localhost:8080/api/productos";

let productService = new ProductService();
/*
    Controller of products test
*/

describe("Product tests", () => {
  // All products
  it("GET /productos", async () => {
    const response = await axios.get(url);
    assert.equal(response.status, 200);
  });

  // Single product
  it("GET /productos/:id", async () => {
    let products = await productService.getAllProducts();

    let productsIds = [];
    products.forEach(async (product) => {
      productsIds.push(product.id);
    });

    let randomProductId =
      productsIds[Math.floor(Math.random() * productsIds.length)];

    const response = await axios.get(`${url}/${randomProductId}`);
    assert.equal(response.status, 200);
  });

  // Create product
  it("POST /productos", async () => {
    const response = await axios.post(
      url,
      {
        title: "Test",
        price: 100,
        description: "Test",
        code: "code",
        thumbnail: "thumbnail",
        stock: 100,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer admin",
        },
      }
    );
    assert.equal(response.status, 201);
  });

  // Update product
  it("PUT /productos/:id", async () => {
    const response = await axios.put(`${url}/1`, {
      title: "Test",
      price: 100,
      description: "Test",
      code: "code",
      thumbnail: "thumbnail",
      stock: 100,
    });
    assert.equal(response.status, 200);
  });
});
