// MODULES ==================================================

const LocalStrategy = require("passport-local").Strategy;

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();

module.exports = function (passport) {
	// SERIALIZATION ==========================================

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (user, done) {
		done(null, user);
	});

	// CONFIG =================================================

	passport.use(
		new LocalStrategy({ usernameField: "username", passwordField: "password" }, async function (username, password, done) {
			if (username !== "createbaseadminaccess") {
				return done(null, false, { message: "Incorrect username." });
			}
			if (password !== process.env.PASSWORD) {
				return done(null, false, { message: "Incorrect password." });
			}
			return done(null, username);
		})
	);
};

// END ======================================================
