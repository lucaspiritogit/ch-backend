const express = require("express");
const app = express();
const path = require("path");
const Container = require("../service/Container.js");
const routerCarrito = express.Router();

const container = new Container("./src/api/db/carrito.txt");
app.use(express.static(path.join(__dirname, "./src/api/public")));

module.exports = routerCarrito;
