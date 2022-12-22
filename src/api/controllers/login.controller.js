const dotenv = require("dotenv");
const Logger = require("../utils/logger.js");
const logger = new Logger();
dotenv.config();

async function loginView(req, res) {
  res.render("./login.hbs");
}

async function login(req, res) {
  logger.logInfoRoute("Login succesful");
  res.render("./index.hbs");
}

async function loginViewError(req, res) {
  res.render("./loginError.hbs");
}

module.exports = { loginView, login, loginViewError };
