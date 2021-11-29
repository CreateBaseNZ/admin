// MODULES ==================================================

const express = require("express");
const path = require("path");
const axios = require("axios");

// VARIABLES ================================================

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const router = new express.Router();
const routeOptions = { root: path.join(__dirname, "../views") };

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

// @route     GET /
// @desc
// @access    PUBLIC
router.get("/", restrictPage, (req, res) => res.sendFile("home.html", routeOptions));

// @route     GET /login
// @desc
// @access    PUBLIC
router.get("/login", (req, res) => res.sendFile("login.html", routeOptions));

// @route     GET /dashboard
// @desc
// @access    PUBLIC
router.get("/dashboard", restrictPage, (req, res) => res.sendFile("dashboard.html", routeOptions));

// @route     GET /temp
// @desc
// @access    PUBLIC
router.get("/temp", restrictPage, (req, res) => res.sendFile("temp.html", routeOptions));

// @route     GET /logout
// @desc
// @access    PUBLIC
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/login");
});

// @route     POST /send-cold-emails
// @desc
// @access    PUBLIC
router.post("/send-cold-emails", restrictData, async (req, res) => {
	// Initialise API Keys and URL
	const keys = { PRIVATE_API_KEY: process.env.PRIVATE_API_KEY, ADMIN_API_KEY: process.env.ADMIN_API_KEY };
	const url = process.env.ROUTE_URL + "/mail/admin/send-cold-emails";
	// Send request to the main backend
	let data;
	try {
		data = (await axios.post(url, { ...keys }))["data"];
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
