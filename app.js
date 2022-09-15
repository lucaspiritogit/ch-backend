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

/* --------------------------- Middleware ---------------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./src/api/public")));

/* --------------------------- Router ---------------------------------- */
const routerProductos = require("./src/api/routes/productos.routes.js");
const routerCarrito = require("./src/api/routes/carrito.routes.js");

app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

server.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});
