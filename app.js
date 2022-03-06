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
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 },
	})
);
// Passport
require("./configs/passport.js")(passport);
app.use(passport.initialize());
app.use(passport.session());

// ROUTERS ==================================================

require("./routes/auth.js")(app, passport);
const generalRouter = require("./routes/general.js");
app.use(generalRouter);
const groupRouter = require("./routes/group.js");
app.use(groupRouter);
const dashboardRouter = require("./routes/dashboard.js");
app.use(dashboardRouter);
const tempRouter = require("./routes/temp.js");
app.use(tempRouter);

// END ======================================================
