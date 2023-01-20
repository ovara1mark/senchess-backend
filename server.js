// required packages
const path = require("path");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const passport = require("passport");

//required controllers
const errorController = require("./controllers/error");

//required models
const User = require("./models/user");

//required routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// Load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

// sessions and csrf logic setup
const MONGODB_URI =
  "mongodb://127.0.0.1:27017/senchess?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// routes endpoints
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use("/auth", authRoutes);

// controllers endpoints
app.use(errorController.get404);
const server = http.createServer(app);

// database and server connections
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    server.listen(3100);
  })
  .catch((err) => {
    console.log(err);
  });
