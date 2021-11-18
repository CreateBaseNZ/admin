// MODULES ==================================================

const axios = require("axios");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();

// MIDDLEWARE ===============================================

const restrictPage = (req, res, next) => {
	// If user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
		return next();
	} else {
		// If they aren't redirect them to the homepage
		return res.redirect("/login");
	}
};

const restrictData = (req, res, next) => {
	// If user is authenticated in the session, carry on
	if (req.isAuthenticated()) {
		return next();
	} else {
		// If they aren't redirect them to the homepage
		return res.send({ status: "critical error" });
	}
};

// ROUTES ===================================================

module.exports = function (app, passport) {
	// @route     POST /group/fetch-unverified
	// @desc
	// @access    PUBLIC
	app.post("/group/fetch-unverified", restrictData, async (req, res) => {
		// Construct the input object
		const input = { query: { verified: false }, option: { license: [], profile: [], account: [] } };
		// Send request to the main backend
		let data;
		try {
			data = (
				await axios.post(process.env.ROUTE_URL + "/group/retrieve", {
					PRIVATE_API_KEY: process.env.PRIVATE_API_KEY,
					ADMIN_API_KEY: process.env.ADMIN_API_KEY,
					input,
				})
			)["data"];
		} catch (error) {
			data = { status: "error", content: error };
		}
		// Success handler
		return res.send(data);
	});

	// @route     POST /group/verify
	// @desc
	// @access    PUBLIC
	app.post("/group/verify", restrictData, async (req, res) => {
		// Construct the input object
		const input = req.body.input;
		// Send request to the main backend
		let data;
		try {
			data = (
				await axios.post(process.env.ROUTE_URL + "/group/school/verify", {
					PRIVATE_API_KEY: process.env.PRIVATE_API_KEY,
					ADMIN_API_KEY: process.env.ADMIN_API_KEY,
					input,
				})
			)["data"];
		} catch (error) {
			data = { status: "error", content: error };
		}
		// Success handler
		return res.send(data);
	});
};

// END ======================================================
