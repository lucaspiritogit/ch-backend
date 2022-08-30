const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const routerProductos = require("./src/api/routes/productos.routes.js");
const Container = require("./src/api/service/Container.js");
const { SocketAddress } = require("net");

const PORT = 8080;
const container = new Container("./src/api/db/productos.txt");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./src/api/public")));

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "pug");

app.use("/api/productos", routerProductos);

app.get("/", (req, res) => {
  try {
    res.render("formPost.pug", { data: container.getAll() });
  } catch (error) {
    res.render("formPost.pug");
  }
});

// socket
io.on("connection", socket => {
  console.log(`Conectado: ${socket.id}`);
  io.sockets.emit("productos", container.getAll());
});

server.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});

// glitch sv: https://glitch.com/edit/#!/oval-victorious-peridot?path=server%2Fapp.js%3A14%3A23
