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
import minimist from "minimist";
import { fork } from "child_process";

let options = { alias: { p: "puerto" } };
let args = minimist(process.argv.slice(2), options);

const LocalStrategy = Strategy;

const containerProdMongo = new ProductosMongoDAO();

const app = express();
const server = new HttpServer(app);
const io = new Socket(server);
let PORT = args._[0];
if (args._[0] === null || args._[0] === undefined) {
  PORT = 8080;
}

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

// home
app.get("/", (req, res) => {
  res.render("./index.hbs");
});

//info - clase28
app.get("/info", (req, res) => {
  let vars = process.argv;
  let projectPath = vars[1];
  let os = process.platform;
  let nodeVersion = process.version;
  let rss = process.memoryUsage().heapUsed;
  let processId = process.pid;
  let processCwd = process.cwd();

  res.render("./info.hbs", { projectPath, vars, os, nodeVersion, rss, processId, processCwd });
});

app.get("/api/randoms", (req, res) => {
  let cant = req.query.cant;

  if (!req.query.cant) {
    cant = 10000000;
  }

  const child = fork("./src/api/public/js/operation.js");
  child.send(cant, () => {});

  child.on("message", message => {
    console.log(message, "from child");
    res.json({ message });
  });
  res.json({});
});

// login
app.get("/login", (req, res) => {
  res.render("./login.hbs");
});

app.post(
  "/login",
  passport.authenticate("local-login", { successRedirect: "/", failureRedirect: "/loginError" })
);

app.get("/loginError", (req, res) => {
  res.render("./loginError.hbs");
});

// register
app.get("/register", (req, res) => {
  res.render("./register.hbs");
});

app.post(
  "/register",
  passport.authenticate("local-register", {
    successRedirect: "/login",
    failureRedirect: "/registerError",
  })
);

app.get("/registerError", (req, res) => {
  res.render("./registerError.hbs");
});

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

server.listen(PORT, () => {
  console.log(`Server up at http://localhost:${PORT}`);
});
