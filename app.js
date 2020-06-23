/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const expressSession = require("express-session");
const passport = require("passport");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const app = express();
const maintenance = require("./config/maintenance.js");

/*=========================================================================================
SETUP DATABASE
=========================================================================================*/

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

/*=========================================================================================
SETUP SERVER
=========================================================================================*/

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
  maintenance();
});

/*=========================================================================================
GENERAL MIDDLEWARE
=========================================================================================*/

// Express Middleware: Serve Static Files (HTML, CSS, JS, Images)
app.use(express.static(__dirname));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
// Parse Cookie header and populate req.cookies
app.use(cookieParser());

/*=========================================================================================
SETUP AUTHENTICATION (PASSPORT JS)
=========================================================================================*/

app.use(expressSession({
  secret: process.env.COOKIES_SECRET_KEY, saveUninitialized: true,
  resave: true, rolling: true, sameSite: "none", cookie: {
    domain: process.env.DOMAIN
  }
}));

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

const adminGeneralRoute = require("./routes/general.js");
const adminFileRoute = require("./routes/file.js");
const adminMakeRoute = require("./routes/make.js");
const adminDiscountRoute = require("./routes/discount.js");
app.use(adminGeneralRoute);
app.use(adminFileRoute);
app.use(adminMakeRoute);
app.use(adminDiscountRoute);

/*=========================================================================================
END
=========================================================================================*/
