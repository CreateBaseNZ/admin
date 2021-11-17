// MODULES ==================================================

const express = require("express");
const axios = require("axios");

// VARIABLES ================================================

const router = new express.Router();
if (process.env.NODE_ENV !== "production") require("dotenv").config();

// ROUTES ===================================================

// @route     POST /group/fetch-unverified
// @desc
// @access    PUBLIC
router.post("/group/fetch-unverified", async (req, res) => {
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
router.post("/group/verify", async (req, res) => {
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

// EXPORT ===================================================

module.exports = router;

// END ======================================================
