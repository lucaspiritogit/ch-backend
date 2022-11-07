const cookieParser = require("cookie-parser");
const express = require("express");
const { json, urlencoded } = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");
const ProductosMongoDAO = require("./src/api/dao/products/ProductosMongoDAO.js");
const daoMensajes = require("./src/api/dao/MensajesMongoDAO.js");
const passport = require("passport");
const { Strategy } = require("passport-local");
const User = require("./src/api/models/userModel.js");
const minimist = require("minimist");
const { fork } = require("child_process");
const normalizr = require("normalizr");
const cluster = require("cluster");
const os = require("os");
/* ---------------------------- Server Creation with Socket.io ------------------------- */
const app = express();
const server = http.createServer(app);
const io = new Server(server);

/* ---------------------------- args ------------------------- */
let options = { alias: { p: "puerto", m: "modo" }, default: { p: 8080, m: "fork" } };
let args = minimist(process.argv.slice(2), options);
let PORT = args.p;
let changeInitMode = args.m;

if (args.m === "cluster") {
  changeInitMode = "cluster";
}
console.table(args);
console.log(`Mode is now: ${args.m}`);
console.log("processes", process.pid);

if (cluster.isPrimary && args.m === "cluster") {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
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
  const LocalStrategy = Strategy;
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

  /* ---------------------------- Retrieve Messages & Products from DB ------------------------- */
  const dao = new daoMensajes();
  const containerProdMongo = new ProductosMongoDAO();

  /* --------------------------- Router ---------------------------------- */
  const routerCarrito = require("./src/api/routes/carrito.routes.js");
  const routerProductos = require("./src/api/routes/productos.routes.js");
  const { log, table } = require("console");

  app.use("/api/productos", routerProductos);
  app.use("/api/carrito", routerCarrito);

  // home
  app.get("/", (req, res) => {
    res.render("./index.hbs");
  });

  // info - clase28
  app.get("/info", (req, res) => {
    let vars = process.argv;
    let projectPath = vars[1];
    let operativeSystem = os.platform;
    let nodeVersion = process.version;
    let rss = process.memoryUsage().heapUsed;
    let processId = process.pid;
    let processCwd = process.cwd();
    let cpus = os.cpus().length;

    res.render("./info.hbs", {
      projectPath,
      vars,
      operativeSystem,
      nodeVersion,
      rss,
      processId,
      processCwd,
      cpus,
    });
  });

  app.get("/api/randoms", (req, res) => {
    let cant = parseInt(req.query.cant);

    if (!req.query.cant) {
      cant = 1000000;
    }

    const child = fork("./operation.js");
    child.send({ cant: cant });

    child.on("message", message => {
      res.send(message);
    });
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

  const normalizarMsj = msjs => {
    return normalizr.normalize(msjs, messagesSchema);
  };

  async function mostrarMensajesNormalizados() {
    const allMessages = await dao.getAll();
    const normalizedMessages = normalizarMsj({ id: "msj", allMessages });
    return normalizedMessages;
  }

  io.on("connection", async socket => {
    console.log("user connected with socket id:", socket.id);

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
}
