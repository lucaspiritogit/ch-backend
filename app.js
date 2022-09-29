import express, { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import { Server as HttpServer } from "http";
import { join } from "path";

const app = express();
const server = new HttpServer(app);

const PORT = 8080;

/* ---------------------------- Middlewares ------------------------- */
app.use(json());
app.use(urlencoded({ extended: true }));

/* ---------------------------- Views ------------------------- */
app.set("views", join("/views"));
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

server.listen(PORT, () => {
  console.log(`Server up at http://localhost:${PORT}`);
});
