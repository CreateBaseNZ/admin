// MODULES ==================================================

const express = require("express");
const axios = require("axios");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const router = new express.Router();

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

// @route     POST /dashboard/fetch-profiles
// @desc
// @access    PUBLIC
router.post("/dashboard/fetch-profiles", restrictData, async (req, res) => {
	// Initialise API Keys and URL
	const keys = { PRIVATE_API_KEY: process.env.PROD_PRIVATE_API_KEY };
	const url = process.env.PROD_ROUTE_URL + "/profile/retrieve";
	const input = { query: {}, option: {} };
	// Send request to the main backend
	let data;
	try {
		data = (await axios.post(url, { ...keys, input }))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	// Success handler
	return res.send(data);
});

// FUNCTIONS ================================================

// EXPORT ===================================================

module.exports = router;

// END ======================================================
