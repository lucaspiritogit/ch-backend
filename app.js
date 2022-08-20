const express = require("express");
const app = express();
const routerProductos = require("./src/api/routes/productos.routes.js");
const path = require("path");

const PORT = 8080;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./src/api/public")));

app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});

/*
    /api/productos
*/
app.use("/api/productos", routerProductos);

/* 
    /
*/
app.get("/", (req, res) => {
  res.sendFile("./index.html");
});

// glitch sv: https://glitch.com/edit/#!/oval-victorious-peridot?path=server%2Fapp.js%3A14%3A23
