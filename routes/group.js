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

// @route     POST /group/fetch-unverified
// @desc
// @access    PUBLIC
router.post("/group/fetch-unverified", restrictData, async (req, res) => {
	// Initialise API Keys and URL
	const keys = { API_KEY_PRIVATE: process.env.API_KEY_PRIVATE, API_KEY_ADMIN: process.env.API_KEY_ADMIN };
	const url = process.env.PREFIX_BACKEND + "/group/retrieve";
	// Construct the input object
	const input = { query: { verified: false }, option: { license: [], profile: [], account: [] } };
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

// @route     POST /group/verify
// @desc
// @access    PUBLIC
router.post("/group/verify", restrictData, async (req, res) => {
	// Initialise API Keys and URL
	const keys = { API_KEY_PRIVATE: process.env.API_KEY_PRIVATE, API_KEY_ADMIN: process.env.API_KEY_ADMIN };
	const url = process.env.PREFIX_BACKEND + "/group/school/verify";
	// Construct the input object
	const input = req.body.input;
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
