import cookieParser from "cookie-parser";
import express, { json, urlencoded } from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import { Server as HttpServer } from "http";
import normalizr from "normalizr";
import { Server as Socket } from "socket.io";
import ProductosMongoDAO from "./src/api/dao/products/ProductosMongoDAO.js";
import passport from "passport";
import { Strategy } from "passport-local";
import User from "./src/api/models/userModel.js";

const LocalStrategy = Strategy;

const containerProdMongo = new ProductosMongoDAO();

const app = express();
const server = new HttpServer(app);
const io = new Socket(server);
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
app.use(
  session({
    secret: "asd123",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 200000 },
  })
);
app.use(cookieParser());

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

/* --------------------------- Passport ---------------------------------- */

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  "local-register",
  new LocalStrategy(async function (username, password, done) {
    try {
      const userExists = await User.findOne({ username });

      if (userExists) {
        console.log("User already exists!");
        return done(null, false);
      }

      const user = await User.create({ username, password });
      return done(null, user);
    } catch (error) {
      throw error;
    }
  })
);

passport.use(
  "local-login",
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username: username });
      console.log(user);
      if (!user) return done(null, false);
      const isMatch = await user.matchPassword(password);
      if (!isMatch) return done(null, false);
      // if passwords match return user
      return done(null, user);
    } catch (error) {
      throw error;
    }
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

// login

app.get("/login", (req, res) => {
  res.render("./login.hbs");
});

app.post(
  "/login",
  passport.authenticate("local-login", { successRedirect: "/", failureRedirect: "/login" })
);

// register

app.get("/register", (req, res) => {
  res.render("./register.hbs");
});

app.post(
  "/register",
  passport.authenticate("local-register", {
    successRedirect: "/login",
    failureRedirect: "/register",
  })
);

/* --------------------------- SocketIO ---------------------------------- */

const authorSchema = new normalizr.schema.Entity("author", {}, { idAttribute: "email" });
const messageSchema = new normalizr.schema.Entity(
  "message",
  { author: authorSchema },
  { idAttribute: "id" }
);
const messagesSchema = new normalizr.schema.Entity(
  "messages",
  {
    messages: [messageSchema],
  },
  { idAttribute: "id" }
);
//////////////////////

const normalizarMsj = msjs => {
  return normalizr.normalize(msjs, messagesSchema);
};

async function mostrarMensajesNormalizados() {
  const allMessages = await dao.getAll();
  const normalizedMessages = normalizarMsj({ id: "msj", allMessages });
  return normalizedMessages;
}
io.on("connection", async socket => {
  // productos
  socket.on("productos-cliente", async data => {
    await containerProdMongo.save(data);

    io.sockets.emit("productos-server", await containerProdMongo.getAll());
  });

  socket.emit("productos-server", await containerProdMongo.getAll());

  // chat
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
  console.log(`Server up at http://localhost:${PORT}`);
});
