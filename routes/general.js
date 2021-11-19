// MODULES ==================================================

const path = require("path");
const axios = require("axios");

// VARIABLES ================================================

const routeOptions = { root: path.join(__dirname, "../views") };
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
	// @route     GET /
	// @desc
	// @access    PUBLIC
	app.get("/", restrictPage, (req, res) => res.sendFile("home.html", routeOptions));

	// @route     GET /login
	// @desc
	// @access    PUBLIC
	app.get("/login", (req, res) => res.sendFile("login.html", routeOptions));

	// @route     GET /dashboard
	// @desc
	// @access    PUBLIC
	app.get("/dashboard", restrictPage, (req, res) => res.sendFile("dashboard.html", routeOptions));

	// @route     GET /logout
	// @desc
	// @access    PUBLIC
	app.get("/logout", (req, res) => {
		req.logout();
		res.redirect("/login");
	});

	// @route     POST /login
	// @desc
	// @access    PUBLIC
	app.post("/login", passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login" }));

	// @route     POST /POST
	// @desc
	// @access    PUBLIC
	app.post("/send-newsletter", restrictData, async (req, res) => {
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
	app.post("/email-educator", restrictData, async (req, res) => {
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
	app.post("/refactor-mails", restrictData, async (req, res) => {
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
	app.post("/update-cold-emails", restrictData, async (req, res) => {
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

	// @route     POST /send-cold-emails
	// @desc
	// @access    PUBLIC
	app.post("/send-cold-emails", restrictData, async (req, res) => {
		// Send request to the main backend
		let data;
		try {
			data = (
				await axios.post(process.env.ROUTE_URL + "/mail/admin/send-cold-emails", {
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

	// @route     POST /dashboard/fetch-profiles
	// @desc
	// @access    PUBLIC
	app.post("/dashboard/fetch-profiles", restrictData, async (req, res) => {
		// Send request to the main backend
		let data;
		try {
			data = (
				await axios.post(process.env.ROUTE_URL_DEPLOY + "/profile/retrieve", {
					PRIVATE_API_KEY: process.env.PRIVATE_API_KEY_DEPLOY,
					input: { query: {}, option: {} },
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
