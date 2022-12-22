const dotenv = require("dotenv");
const Logger = require("../utils/logger.js");
const logger = new Logger();
dotenv.config();

async function registerView(req, res) {
  res.render("./register.hbs");
}

async function register(req, res) {
  logger.logInfoRoute("Register succesful");
}

async function registerViewError(req, res) {
  res.render("./registerError.hbs");
}

module.exports = { registerView, registerViewError, register };
