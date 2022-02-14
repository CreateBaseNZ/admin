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
	const input = { query: {}, option: {} };
	// Send request to the main backend
	const url1 = process.env.PROD_ROUTE_URL + "/profile/retrieve";
	const input1 = { query: {}, option: { account: [] } };
	let data1;
	try {
		data1 = (await axios.post(url1, { ...keys, input: input1 }))["data"];
	} catch (error) {
		data1 = { status: "error", content: error };
	}
	if (data1.status !== "succeeded") return res.send({ status: "error", content: data1.content });
	// Retrieve licenses
	const url2 = process.env.PROD_ROUTE_URL + "/license/retrieve";
	let data2;
	try {
		data2 = (await axios.post(url2, { ...keys, input }))["data"];
	} catch (error) {
		data2 = { status: "error", content: error };
	}
	if (data2.status !== "succeeded") return res.send({ status: "error", content: data2.content });
	// Retrieve groups
	const url3 = process.env.PROD_ROUTE_URL + "/group/retrieve";
	let data3;
	try {
		data3 = (await axios.post(url3, { ...keys, input }))["data"];
	} catch (error) {
		data3 = { status: "error", content: error };
	}
	if (data3.status !== "succeeded") return res.send({ status: "error", content: data3.content });
	// For each license assign the group
	let licenses = [];
	for (let i = 0; i < data2.content.length; i++) {
		let license = convertToNormalObject(data2.content[i]);
		license.group = data3.content.find((group) => {
			return group._id.toString() == license.group.toString();
		});
		licenses.push(license);
	}
	// For each profile assign license
	let profiles = [];
	for (let j = 0; j < data1.content.length; j++) {
		let profile = convertToNormalObject(data1.content[j]);
		let profileLicenses = [];
		for (let k = 0; k < profile.licenses.length; k++) {
			const licenseId = profile.licenses[k];
			const license = licenses.find((element) => {
				return element._id.toString() == licenseId.toString();
			});
			profileLicenses.push(license);
		}
		profile.licenses = profileLicenses;
		profiles.push(profile);
	}
	// Success handler
	return res.send({ status: "succeeded", content: profiles });
});

// FUNCTIONS ================================================

function convertToNormalObject(document) {
	return JSON.parse(JSON.stringify(document));
}

// EXPORT ===================================================

module.exports = router;

// END ======================================================
