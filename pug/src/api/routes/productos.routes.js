const express = require("express");
const app = express();
const path = require("path");
const Container = require("../service/Container.js");
const routerProductos = express.Router();
const exphbs = require("express-handlebars");

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "hbs");

app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "",
    layoutsDir: "",
  })
);

const container = new Container("./src/api/db/productos.txt");

routerProductos.get("/", async (req, res, next) => {
  try {
    res.render("getAll", { data: container.getAll() });
  } catch (error) {
    res.send({ error: "No hay productos" });
  }
});

routerProductos.get("/:id", (req, res, next) => {
  try {
    res.send(container.getById(parseInt(req.params.id)));
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerProductos.post("/", (req, res, next) => {
  let data = req.body;
  container.save(data);

  res.status(201).send(data);
});

routerProductos.put("/:id", (req, res, next) => {
  try {
    let data = req.body;

    let modifiedObj = {
      id: parseInt(req.params.id),
      title: data.title,
      price: parseInt(data.price),
      thumbnail: data.thumbnail,
    };

    container.deleteById(req.params.id);
    container.save(modifiedObj);

    res.status(201).send(modifiedObj);
  } catch (error) {
    res.send({ error: "Objeto no encontrado" });
  }
});

routerProductos.delete("/:id", (req, res, next) => {
  try {
    container.deleteById(req.params.id);
    res.send({ message: "Objeto eliminado" });
  } catch (error) {
    res.send({ message: "Objeto no encontrado" });
  }
});

module.exports = routerProductos;
