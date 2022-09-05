const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const server = new HttpServer(app);
const io = new IOServer(server);
const Container = require("./src/api/service/Container.js");
const PORT = 8080;

/* --------------------------- DB ---------------------------------- */
const container = new Container("./src/api/db/productos.txt");
const mensajes = new Container("./src/api/db/mensajes.txt");

/* --------------------------- Middlware ---------------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./src/api/public")));

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

const mensajesArr = [];
// socket
io.on("connection", socket => {
  io.sockets.emit("productos", container.getAll());
  socket.emit("nuevo-mensaje-server", mensajesArr);

  socket.on("nuevo-mensaje-cliente", data => {
    mensajesArr.push(data);
    mensajes.save(data);

    io.sockets.emit("nuevo-mensaje-server", mensajesArr);
  });
});

server.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});
