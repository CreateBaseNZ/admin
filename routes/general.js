// MODULES ==================================================

const express = require("express");
const path = require("path");

// VARIABLES ================================================

const router = new express.Router();
const routeOptions = { root: path.join(__dirname, "../views") };

// ROUTES ===================================================

// @route     GET /
// @desc
// @access    PUBLIC
router.get("/", (req, res) => res.sendFile("home.html", routeOptions));

// EXPORT ===================================================

module.exports = router;

// END ======================================================
