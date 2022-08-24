const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const routerProductos = require("./src/api/routes/productos.routes.js");
const path = require("path");

const PORT = 8080;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./src/api/public")));
// app.set("views", path.join(__dirname + "/views"));
// app.set("view engine", "ejs");

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "hbs");

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: "hbs",
  })
);

app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});

app.use("/api/productos", routerProductos);

app.get("/", (req, res) => {
  res.render("./layouts/main.hbs");
});

// glitch sv: https://glitch.com/edit/#!/oval-victorious-peridot?path=server%2Fapp.js%3A14%3A23
