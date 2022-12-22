const { Router } = require("express");
const routerLogout = Router();
const { logoutView, logout } = require("../controllers/logout.controller.js");

routerLogout.get("/", logoutView);

routerLogout.post("/", logout);

module.exports = routerLogout;
