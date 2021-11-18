// MODULES ==================================================

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const app = express();

// SERVER ===================================================

app.listen(process.env.PORT, () => console.log(`Server is running at port ${process.env.PORT}`));

// MIDDLEWARE ===============================================

// Express Middleware: Serve Static Files (HTML, CSS, JS, Images)
app.use(express.static(__dirname));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
// Security
app.use(helmet({ contentSecurityPolicy: false }));
// Session
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
// Passport
require("./configs/passport.js")(passport);
app.use(passport.initialize());
app.use(passport.session());

// ROUTERS ==================================================

require("./routes/general.js")(app, passport);
require("./routes/group.js")(app, passport);

// END ======================================================
