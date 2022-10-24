import * as dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import * as url from "url";
import { productoDao } from "./src/api/dao/setDB.js";
dotenv.config();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express();
const server = new HttpServer(app);
const io = new IOServer(server);

const PORT = 8080;

/* ---------------------------- Middlewares ------------------------- */
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static(__dirname + "src/api/public"));
/* ---------------------------- Views ------------------------- */
app.set("view engine", "hbs");

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "",
    layoutsDir: "",
  })
);

/* --------------------------- Router ---------------------------------- */
import routerCarrito from "./src/api/routes/carrito.routes.js";
import routerProductos from "./src/api/routes/productos.routes.js";

app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

app.get("/", (req, res) => {
  res.render("./index.hbs");
});

/* --------------------------- SocketIO ---------------------------------- */
io.on("connection", async socket => {
  socket.on("productos-cliente", data => {
    productoDao.save(data);
    io.sockets.emit("productos-server", productoDao.getAll());
  });

  socket.emit("productos-server", productoDao.getAll());

  let mensajesArray = [];
  socket.on("nuevo-mensaje-cliente", async data => {
    try {
      mensajes.save(data);
      mensajesArray.push(data);
      io.sockets.emit("nuevo-mensaje-server", mensajesArray);
    } catch (error) {
      throw error;
    }
  });

  socket.emit("nuevo-mensaje-server", mensajesArray);
});

server.listen(PORT, () => {
  console.log(`Server up at http://localhost:${PORT}`);
});
