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
const compression = require("compression");
const Logger = require("./logs/logger.js");
const multer = require("multer");
const nodemailer = require("nodemailer");
const CarritoMongoDAO = require("./src/api/dao/carrito/CarritoMongoDAO.js");
/* ---------------------------- Server Creation with Socket.io ------------------------- */
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const logger = new Logger();

/* ---------------------------- args ------------------------- */
let options = { alias: { p: "puerto", m: "modo" }, default: { p: 8080, m: "fork" } };
let args = minimist(process.argv.slice(2), options);
let PORT = process.env.PORT || 8080;
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

  /* --------------------------- Multer ---------------------------------- */
  const storage = multer.diskStorage({
    destination: "avatars",
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  app.use(
    multer({
      storage,
      dest: "avatars",
    }).single("image")
  );

  /* --------------------------- Nodemailer ---------------------------------- */
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

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
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email", passwordField: "password" },
      async (req, email, password, done) => {
        try {
          const userExists = await User.findOne({ email });

          if (userExists) {
            return done(null, false);
          }

          const address = req.body.address;
          const age = req.body.address;
          const phoneNumber = req.body.phone;
          const avatar = req.file;
          const user = await User.create({ email, password, address, age, phoneNumber, avatar });

          let emailContent = {
            from: "NodeJS Lucas Pirito Coderhouse",
            to: process.env.EMAIL,
            subject: "Nuevo registro - Coderhouse backend",
            html: `<h1>Nuevo registro en la aplicacion</h1>
            <h3>Email:${user.email}</h3> 
            <br />
            <h3>Age:${user.age}</h3>     
            <br />
            <h3>Phone number: ${user.phoneNumber}</h3>      
            <br />
            <h3>URL del avatar: ${user.avatar.path}</h3>    
            `,
          };

          const sentEmail = await transporter.sendMail(emailContent);
          logger.logInfoRoute(`Sent email: ${emailContent.html}`);
          return done(null, user);
        } catch (error) {
          throw error;
        }
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user) return done(null, false);
          const isMatch = await user.matchPassword(password);
          if (!isMatch) return done(null, false);
          // if passwords match return user
          return done(null, user);
        } catch (error) {
          throw error;
        }
      }
    )
  );

  /* ---------------------------- Retrieve Messages & Products from DB ------------------------- */
  const dao = new daoMensajes();
  const containerProdMongo = new ProductosMongoDAO();
  const containerCarritoMongo = new CarritoMongoDAO();

  /* --------------------------- Router ---------------------------------- */
  const routerCarrito = require("./src/api/routes/carrito.routes.js");
  const routerProductos = require("./src/api/routes/productos.routes.js");

  app.use("/api/productos", routerProductos);
  app.use("/api/carrito", routerCarrito);

  const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/login");
    }
  };
  // home
  app.get("/", isLoggedIn, async (req, res) => {
    let user = { username: req.user.email, avatar: req.user.avatar.path };
    res.render("./index.hbs", { user });
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

  // login
  app.get("/login", (req, res) => {
    res.render("./login.hbs");
  });

  app.post(
    "/login",
    passport.authenticate("local-login", { failureRedirect: "/loginError", successRedirect: "/" }),
    (req, res) => {
      logger.logInfoRoute("Login succesful");
      res.render("./index.hbs");
    }
  );
  app.get("/loginError", (req, res) => {
    logger.logError("The user doesnt exist or the login values are incorrect.");
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

  // logout
  app.get("/logout", (req, res) => {
    res.render("./logout.hbs");
  });

  app.post("/logout", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
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
      try {
        await containerProdMongo.save(data);
        io.sockets.emit("productos-server", await containerProdMongo.getAll());
      } catch (error) {
        logger.logError(error);
        throw { error: "MongoDB connection failed" };
      }
    });

    socket.emit("productos-server", await containerProdMongo.getAll());

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
