// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();

// ROUTES ===================================================

module.exports = function (app, passport) {
	// @route     POST /login
	// @desc
	// @access    PUBLIC
	app.post("/login", passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login" }));
};

// END ======================================================
