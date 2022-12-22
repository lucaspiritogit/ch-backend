const { Router } = require("express");
const routerLogin = Router();
const { loginView, login, loginViewError } = require("../controllers/login.controller.js");
const passport = require("passport");
const User = require("../models/userModel.js");
const { Strategy } = require("passport-local");

// Passport
const LocalStrategy = Strategy;
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

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
//

routerLogin.get("/", loginView);

routerLogin.post(
  "/",
  passport.authenticate("local-login", { failureRedirect: "/loginError", successRedirect: "/" }),
  login
);

routerLogin.get("/loginError", loginViewError);

module.exports = routerLogin;
