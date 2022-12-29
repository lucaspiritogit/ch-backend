const ProductService = require("../api/service/ProductService.js");
const url = "http://localhost:8080/api/productos";
const request = require("supertest")(url);
const expect = require("chai").expect;
let productService = new ProductService();

/*
    Controller of products test
*/
console.log("Testing products with MochaChaiSupertest");

describe("Product tests", () => {
  // All products
  it("GET /productos", async () => {
    const responseChaiSuper = await request.get("/").expect(200);
    expect(responseChaiSuper.status).to.eql(200);
  });

  // Single product
  it("GET /productos/:id", async () => {
    let products = await productService.getAllProducts();
    let productsIds = [];
    products.forEach(async product => {
      productsIds.push(product.id);
    });

    let randomProductId = productsIds[Math.floor(Math.random() * productsIds.length)];

    const productsSuperChai = await request.get(`/${randomProductId}`).expect(200);
    expect(productsSuperChai.status).to.eql(200);
  });

  // Create product
  it("POST /productos", async () => {
    const product = JSON.stringify(
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
    const responseChaiSuper = await request.post("/").send(
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
    expect(responseChaiSuper.status).to.eql(200);
  });

  // Update product
  it("PUT /productos/:id", async () => {
    let products = await productService.getAllProducts();
    let productsIds = [];
    products.forEach(async product => {
      productsIds.push(product.id);
    });

    let randomProductId = productsIds[Math.floor(Math.random() * productsIds.length)];
    const responseChaiSuper = await request.put(`/${randomProductId}`).send(
      {
        title: "Changed by test",
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
    expect(responseChaiSuper.status).to.eql(201);
  });
});
