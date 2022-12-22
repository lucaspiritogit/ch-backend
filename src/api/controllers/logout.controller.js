const dotenv = require("dotenv");
const Logger = require("../utils/logger.js");
const logger = new Logger();
dotenv.config();

async function logoutView(req, res) {
  res.render("./logout.hbs");
}

async function logout(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

module.exports = { logoutView, logout };
