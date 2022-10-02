const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const server = new HttpServer(app);
const io = new IOServer(server);
const fs = require("fs");

const { faker } = require('@faker-js/faker');

const PORT = 8080;

/* ---------------------------- Instances ------------------------- */
const Container = require("./src/api/service/Container.js");
const Repository = require("./src/api/public/js/Repository.js");

const RepositoryProducts = require("./src/api/public/js/RepositoryProduct.js");
const repositoryProducts = new RepositoryProducts("productos");

/* ---------------------------- DB ------------------------- */
const repository = new Repository("mensajes");

/* ---------------------------- Middlewares ------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./src/api/public")));

/* ---------------------------- Views ------------------------- */
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

/* --------------------------- Mocks Productos ---------------------------------- */

app.get("/api/productos-test", (req, res) => {
  const mockProduct = {
    name: faker.commerce.productName(),
    price: faker.commerce.price(100, 10000, '$'),
    thumbnail: faker.image.imageUrl(640, 480, 'product')
  }
  res.json(mockProduct)
})


/* --------------------------- Router ---------------------------------- */
const routerProductos = require("./src/api/routes/productos.routes.js");
const routerCarrito = require("./src/api/routes/carrito.routes.js");

app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

app.get("/", (req, res) => {
  try {
    res.render("index.hbs", { data: container.getAll() });
  } catch (error) {
    res.render("index.hbs");
  }
});

/* --------------------------- SocketIO ---------------------------------- */
io.on("connection", async socket => {
  socket.on("productos-cliente", async data => {
    repositoryProducts.insert(data);
    io.sockets.emit("productos-server", await repositoryProducts.findAll());
  });

  socket.emit("productos-server", await repositoryProducts.findAll());

  socket.on("nuevo-mensaje-cliente", async data => {
    try {
      repository.insert(data);
      io.sockets.emit("nuevo-mensaje-server", await repository.findAll());
    } catch (error) {
      throw error;
    }
  });

  socket.emit("nuevo-mensaje-server", await repository.findAll());
});

server.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});
