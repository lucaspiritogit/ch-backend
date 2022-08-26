const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const routerProductos = require("./src/api/routes/productos.routes.js");
const path = require("path");
const Container = require("./src/api/service/Container.js");

const PORT = 8080;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./src/api/public")));

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "pug");

app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});

app.use("/api/productos", routerProductos);

app.get("/", (req, res) => {
  res.render("formPost.pug");
});

// glitch sv: https://glitch.com/edit/#!/oval-victorious-peridot?path=server%2Fapp.js%3A14%3A23
