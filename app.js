import express, { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import { Server as HttpServer } from "http";
import normlizr from "normalizr";
import { Server as IOServer } from "socket.io";
const app = express();
const server = new HttpServer(app);
const io = new IOServer(server);

import { faker } from "@faker-js/faker";

const PORT = 8080;

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
const authorSchema = new normlizr.schema.Entity("author", { idAttribute: "id" });
const messageSchema = new normlizr.schema.Entity("message", { idAttribute: "id" });
const messagessSchema = new normlizr.schema.Entity("messages", {
  author: authorSchema,
  messages: messageSchema,
});
io.on("connection", async socket => {
  socket.on("nuevo-mensaje-cliente", async data => {
    try {
      await dao.save(data);
      const normalizedData = normlizr.normalize(data, messagessSchema, { idAttribute: "id" });
      console.log(
        "data normalizada:",
        "🚀 ~ file: app.js ~ line 112 ~ normalizedData",
        normalizedData
      );
      const denormalizedData = normlizr.denormalize(data, messagessSchema);
      console.log(
        "data desnormalizada:",
        "🚀 ~ file: app.js ~ line 115 ~ denormalizedData",
        denormalizedData
      );
      const longOriginal = JSON.stringify(data).length;
      const longNormalizada = JSON.stringify(normalizedData).length;

      const porcentaje = ((longOriginal * 100) / longNormalizada).toFixed(2);
      console.log("🚀 ~ file: app.js ~ line 113 ~ porcentaje", `%${porcentaje}`);

      io.sockets.emit("nuevo-mensaje-server", await dao.getAll());
    } catch (error) {
      throw error;
    }
  });

  socket.emit("nuevo-mensaje-server", await dao.getAll());
});

server.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});
