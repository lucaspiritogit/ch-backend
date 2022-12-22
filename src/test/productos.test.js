const axios = require("axios");
const assert = require("assert").strict;

const url = "http://localhost:8080/api/productos";

/*
    Controller of products test
*/

describe("Test de productos", () => {
  // All products
  it("GET /productos", async () => {
    const response = await axios.get(url);
    assert.equal(response.status, 200);
  });

  // Single product
  it("GET /productos/:id", async () => {
    const response = await axios.get(`${url}/1`);
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
});
