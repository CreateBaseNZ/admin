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

// @route     GET /temp/subscribe-users
// @desc
// @access    PUBLIC
router.get("/temp/notify-users", restrictData, async (req, res) => {
	// Initialise API Keys and URL
	const keys = { PRIVATE_API_KEY: process.env.PRIVATE_API_KEY, ADMIN_API_KEY: process.env.ADMIN_API_KEY };
	const url = process.env.ROUTE_URL + "/temp/notify-users";
	// Send the request to the backend
	let data;
	try {
		data = (await axios.post(url, { ...keys }))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	return res.send(data);
});

// @route     GET /temp/subscribe-users
// @desc
// @access    PUBLIC
router.get("/temp/subscribe-users", restrictData, async (req, res) => {
	// Initialise API Keys and URL
	const keys = { PRIVATE_API_KEY: process.env.PRIVATE_API_KEY, ADMIN_API_KEY: process.env.ADMIN_API_KEY };
	const url = process.env.ROUTE_URL + "/temp/subscribe-users";
	// Send the request to the backend
	let data;
	try {
		data = (await axios.post(url, { ...keys }))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	return res.send(data);
});

// FUNCTIONS ================================================

// EXPORT ===================================================

module.exports = router;

// END ======================================================
