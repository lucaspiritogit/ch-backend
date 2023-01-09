const cookieParser = require("cookie-parser");
const express = require("express");
const { json, urlencoded } = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");
const daoMensajes = require("./src/api/dao/MensajesMongoDAO.js");
const passport = require("passport");
const minimist = require("minimist");
const { fork } = require("child_process");
const normalizr = require("normalizr");
const cluster = require("cluster");
const os = require("os");
const compression = require("compression");
const Logger = require("./src/api/utils/logger.js");
const ProductService = require("./src/api/service/ProductService.js");
const MensajeRepository = require("./src/api/repository/MensajeRepository.js");
const routerGraphProductos = require("./src/api/graphql/productos.js");
const routerGraphCarrito = require("./src/api/graphql/carritos.js");

/* ---------------------------- Server Creation with Socket.io ------------------------- */
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const logger = new Logger();

/* ---------------------------- args ------------------------- */
let options = {
  alias: { p: "puerto", m: "modo" },
  default: { p: 8080, m: "fork" },
};
let args = minimist(process.argv.slice(2), options);
let PORT = process.env.PORT || 8080;
let changeInitMode = args.m;

if (args.m === "cluster") {
  changeInitMode = "cluster";
}

// Mongo by default
if (args.t == undefined) {
  args.t = "mongo";
}
console.table(args);
console.log(`Mode is now: ${args.m}`);
console.log("processes", process.pid);
console.log("Connected using:", args.t);
if (cluster.isPrimary && args.m === "cluster") {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
  /* ---------------------------- Middlewares ------------------------- */
  app.use(express.static("./src/api/public"));
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(compression());
  app.use(
    session({
      secret: "asd123",
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: 200000 },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
  app.use("/avatars", express.static("avatars"));

  /* --------------------------- Router ---------------------------------- */
  const routerCarrito = require("./src/api/routes/carrito.routes.js");
  const routerProductos = require("./src/api/routes/productos.routes.js");
  const routerLogin = require("./src/api/routes/login.routes.js");
  const routerRegister = require("./src/api/routes/register.routes.js");
  const routerLogout = require("./src/api/routes/logout.routes.js");

  app.use("/api/productos", routerProductos);
  app.use("/api/carrito", routerCarrito);
  app.use("/login", routerLogin);
  app.use("/register", routerRegister);
  app.use("/logout", routerLogout);
  /* ---------------------------- GraphQL ------------------------- */
  app.use("/graphql/productos", routerGraphProductos);
  app.use("/graphql/carritos", routerGraphCarrito);

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

  /* ---------------------------- Retrieve Messages & Products from DB ------------------------- */
  const dao = new daoMensajes();
  const DAOFactory = require("./src/api/classes/DAOFactory.js");
  const daoFactory = new DAOFactory();

  const productService = new ProductService();
  const mensajeRepository = new MensajeRepository();

  const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
  // home
  app.get("/", isLoggedIn, async (req, res) => {
    try {
      let user = { username: req.user.email, avatar: req.user.avatar.path };
      res.render("./index.hbs", { user });
    } catch (error) {
      throw error;
    }
  });

  // info - clase28
  app.get("/info", (req, res) => {
    logger.logInfoRoute(req.url);
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

    if (changeInitMode == "cluster") {
      function calcularCantidad(cant) {
        let arrOfNumbers = [];
        for (let i = 1; i <= cant; i++) {
          arrOfNumbers.push({
            num: i,
          });
        }
        return arrOfNumbers;
      }
      res.send(calcularCantidad(cant));
    } else {
      const child = fork("./operation.js");
      child.send({ cant: cant });

      child.on("message", message => {
        res.send(message);
      });
    }
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
    const allMessages = await mensajeRepository.getAllMensajes();
    const normalizedMessages = normalizarMsj({ id: "msj", allMessages });
    return normalizedMessages;
  }
  io.on("connection", async socket => {
    console.log("user connected with socket id:", socket.id);
    // productos
    socket.on("productos-cliente", async data => {
      try {
        await productService.createProduct(data);
        io.sockets.emit("productos-server", await productService.getAllProducts());
      } catch (error) {
        logger.logError(error);
        throw { error: "MongoDB connection failed" };
      }
    });

    socket.emit("productos-server", await productService.getAllProducts());

    // chat
    socket.on("nuevo-mensaje-cliente", async data => {
      try {
        await dao.save(data);
        io.sockets.emit("nuevo-mensaje-server", await mostrarMensajesNormalizados());
      } catch (error) {
        logger.logError(error);
        throw { error: "MongoDB connection failed" };
      }
    });

    socket.emit("nuevo-mensaje-server", await mostrarMensajesNormalizados());
  });

  server.listen(PORT, () => {
    console.log(`Server up at http://localhost:${PORT}`);
  });
}
