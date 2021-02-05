/* ==========================================================
MODULES
========================================================== */

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

/* ==========================================================
VARIABLES
========================================================== */

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const app = express();

/* ==========================================================
DATABASE
========================================================== */

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,
});

/* ==========================================================
SERVER
========================================================== */

app.listen(process.env.PORT, () => console.log(`Server is running at port ${process.env.PORT}`));

/* ==========================================================
MIDDLEWARES
========================================================== */

// Express Middleware: Serve Static Files (HTML, CSS, JS, Images)
app.use(express.static(__dirname));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
// Security
app.use(helmet({ contentSecurityPolicy: false }));

/* ==========================================================
AUTHENTICATION
========================================================== */

// Session
app.use(session({
  secret: process.env.SESSION_SECRET, saveUninitialized: true,
  resave: true, rolling: true, sameSite: "none"
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
require("./configs/passport.js");

/* ==========================================================
ROUTERS
========================================================== */

const generalRouter = require("./routes/general.js");
app.use(generalRouter);

const accountRouter = require("./routes/account.js");
app.use(accountRouter);

/* ==========================================================
END
========================================================== */
