const express = require("express");
const Container = require("../src/Container.js");

const PORT = 8080;
const app = express();
const container = new Container("./db/productos.txt");

app.listen(PORT, () => {
  console.log(`Server corriendo en puerto: ${PORT}`);
});

app.get("/", (req, res) => {
  res.send(`
        <h1>Coderhouse Back-end</h1>
        <a href="/productos">/productos</a>
        </br>
        <a href="/productoRandom">/productoRandom</a>
        `);
});

app.get("/productos", async (req, res) => {
  res.send(await container.getAll());
});

app.get("/productoRandom", (req, res) => {
  let calculateRandom = Math.floor(Math.random() * 3) + 1;
  res.send(container.getById(calculateRandom));
});

// glitch sv: https://glitch.com/edit/#!/oval-victorious-peridot?path=server%2Fapp.js%3A14%3A23
