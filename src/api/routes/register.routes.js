const express = require("express");
const { Router } = require("express");
const multer = require("multer");
const routerRegister = Router();
const nodemailer = require("nodemailer");
const passport = require("passport");
const User = require("../models/userModel.js");
const { Strategy } = require("passport-local");
const Logger = require("../utils/logger.js");
const logger = new Logger();
routerRegister.use("/avatars", express.static("avatars"));
const {
  registerView,
  registerViewError,
  register,
} = require("../controllers/register.controller.js");
/* --------------------------- Multer ---------------------------------- */
const storage = multer.diskStorage({
  destination: "avatars",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

routerRegister.use(
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

//Passport
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
//

routerRegister.get("/", registerView);

routerRegister.get("/registerError", registerViewError);

routerRegister.post(
  "/",
  passport.authenticate("local-register", {
    successRedirect: "/login",
    failureRedirect: "/register/registerError",
  }),
  register
);

module.exports = routerRegister;
