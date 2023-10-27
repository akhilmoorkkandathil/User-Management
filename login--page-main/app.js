// modules import
const express = require("express");
const session = require("express-session");
const { router } = require("./router/router");
const adminrouter = require("./router/admin");
const nocache = require("nocache");
const path = require("path");
const app = express();

// view engine
app.set("view engine", "hbs");
app.use(express.static(__dirname + "./public"));
app.use(express.urlencoded({ extended: true }));
// app.use(function (req, res, next) {
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     next()
// });
app.use(nocache());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// router connect
app.use("/", router);
app.use("/admin", adminrouter);

// host
app.listen(3000);
