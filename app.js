import express, { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import { Server as HttpServer } from "http";
import normlizr from "normalizr";
import { Server as Socket } from "socket.io";
const app = express();
const server = new HttpServer(app);
const io = new Socket(server);

import { faker } from "@faker-js/faker";

const PORT = 8080;

//// public
app.use(express.static("public"));
/* ---------------------------- Instances ------------------------- */

/* ---------------------------- DB ------------------------- */
import daoMensajes from "./src/api/dao/MensajesMongoDAO.js";
const dao = new daoMensajes();

/* ---------------------------- Middlewares ------------------------- */
app.use(express.static("./src/api/public"));
app.use(json());
app.use(urlencoded({ extended: true }));

/* ---------------------------- Views ------------------------- */
app.set("views", "./views");
app.set("view engine", "hbs");

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "",
    layoutsDir: "",
  })
);

/* --------------------------- Mock Productos ---------------------------------- */

app.get("/api/productos-test", (req, res) => {
  const mockProduct = [
    {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      thumbnail: faker.image.image(),
    },
    {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      thumbnail: faker.image.image(),
    },
    {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      thumbnail: faker.image.image(),
    },
    {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      thumbnail: faker.image.image(),
    },
    {
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      thumbnail: faker.image.image(),
    },
  ];
  res.json(mockProduct);
});

/* --------------------------- Router ---------------------------------- */
import routerCarrito from "./src/api/routes/carrito.routes.js";
import routerProductos from "./src/api/routes/productos.routes.js";

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

const authorSchema = new normlizr.schema.Entity("author", {}, { idAttribute: "email" });
const messageSchema = new normlizr.schema.Entity(
  "message",
  { author: authorSchema },
  { idAttribute: "id" }
);
const messagesSchema = new normlizr.schema.Entity(
  "messages",
  {
    messages: [messageSchema],
  },
  { idAttribute: "id" }
);
//////////////////////

const normalizarMsj = msjs => {
  return normlizr.normalize(msjs, messagesSchema);
};

async function mostrarMensajesNormalizados() {
  const allMessages = await dao.getAll();
  const normalizedMessages = normalizarMsj({ id: "msj", allMessages });
  return normalizedMessages;
}

io.on("connection", async socket => {
  socket.on("nuevo-mensaje-cliente", async data => {
    try {
      await dao.save(data);

      io.sockets.emit("nuevo-mensaje-server", await mostrarMensajesNormalizados());
    } catch (error) {
      throw error;
    }
  });

  socket.emit("nuevo-mensaje-server", await mostrarMensajesNormalizados());
});

server.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});
