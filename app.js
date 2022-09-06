const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const server = new HttpServer(app);
const io = new IOServer(server);
const fs = require("fs");

const routerProductos = require("./src/api/routes/productos.routes.js");
const Container = require("./src/api/service/Container.js");
const { log } = require("console");
const { setFlagsFromString } = require("v8");

const PORT = 8080;
const container = new Container("./src/api/db/productos.txt");
const mensajes = new Container("./src/api/db/mensajes.txt");

// middleware
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
app.use("/api/productos", routerProductos);

app.get("/", (req, res) => {
  try {
    res.render("index.hbs", { data: container.getAll() });
  } catch (error) {
    res.render("index.hbs");
  }
});

// socket
io.on("connection", socket => {
  socket.emit("productos", container.getAll());

  socket.on("nuevo-mensaje-cliente", data => {
    let mensajesArray = JSON.parse(fs.readFileSync("./src/api/db/mensajes.txt", "utf-8"));
    mensajes.save(data);
    mensajesArray.push(data);
    console.log(mensajesArray);
    io.sockets.emit("nuevo-mensaje-server", mensajesArray);
  });

  socket.emit("nuevo-mensaje-server", mensajes.getAll());
});

server.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});
