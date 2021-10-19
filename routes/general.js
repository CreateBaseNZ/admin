// MODULES ==================================================

const express = require("express");
const path = require("path");
const axios = require("axios");

// VARIABLES ================================================

const router = new express.Router();
const routeOptions = { root: path.join(__dirname, "../views") };

// ROUTES ===================================================

// @route     GET /
// @desc
// @access    PUBLIC
router.get("/", (req, res) => res.sendFile("home.html", routeOptions));

// @route     POST /POST
// @desc
// @access    PUBLIC
router.post("/send-newsletter", async (req, res) => {
	// Construct the input
	const input = { group: req.body.input.group, subject: req.body.input.subject, body: req.body.input.body };
	// TODO: Perform the validation
	// Send request to the main backend
	let data;
	try {
		data = (
			await axios.post(process.env.ROUTE_URL + "/mail/admin/send-newsletter", {
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

// @route     POST /POST
// @desc
// @access    PUBLIC
router.post("/email-educator", async (req, res) => {
	// Construct the input
	const input = { subject: req.body.input.subject, body: req.body.input.body };
	// TODO: Perform the validation
	// Send request to the main backend
	let data;
	try {
		data = (
			await axios.post(process.env.ROUTE_URL + "/mail/admin/email-educator", {
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

// @route     POST /POST
// @desc
// @access    PUBLIC
router.post("/refactor-mails", async (req, res) => {
	// Send request to the main backend
	let data;
	try {
		data = (
			await axios.post(process.env.ROUTE_URL + "/mail/admin/refactor", {
				PRIVATE_API_KEY: process.env.PRIVATE_API_KEY,
				ADMIN_API_KEY: process.env.ADMIN_API_KEY,
			})
		)["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	// Success handler
	return res.send(data);
});

// @route     POST /update-cold-emails
// @desc
// @access    PUBLIC
router.post("/update-cold-emails", async (req, res) => {
	// Send request to the main backend
	let data;
	try {
		data = (
			await axios.post(process.env.ROUTE_URL + "/mail/admin/update-cold-emails", {
				PRIVATE_API_KEY: process.env.PRIVATE_API_KEY,
				ADMIN_API_KEY: process.env.ADMIN_API_KEY,
			})
		)["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	// Success handler
	return res.send(data);
});

// EXPORT ===================================================

module.exports = router;

// END ======================================================
