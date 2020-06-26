/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const path = require("path");
const passport = require("passport");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();
const routeOptions = {
  root: path.join(__dirname, "../views"),
};

/*=========================================================================================
MODELS
=========================================================================================*/

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

const adminAccess = (req, res, next) => {
  if (req.isAuthenticated() && req.user.type === "admin") {
    return next();
  } else {
    res.redirect("/");
  }
};

/*=========================================================================================
ROUTES
=========================================================================================*/

/* ----------------------------------------------------------------------------------------
ACCOUNT
---------------------------------------------------------------------------------------- */

// @route     POST /login
// @desc
// @access    ADMIN
router.post("/login", passport.authenticate("local-admin-login", {
  successRedirect: "/", failureRedirect: "/login"
}))

/* ----------------------------------------------------------------------------------------
NAVIGATION
---------------------------------------------------------------------------------------- */

// @route     GET /
// @desc
// @access    Admin
router.get("/", (req, res) => {
  res.sendFile("home.html", routeOptions);
});

// @route     GET /login
// @desc
// @access    Admin
router.get("/login", (req, res) => res.sendFile("login.html", routeOptions));

// @route     Get /file
// @desc
// @access    Admin
router.get("/file", adminAccess, (req, res) => {
  res.sendFile("file.html", routeOptions);
});

// @route     Get /make
// @desc
// @access    Admin
router.get("/make", adminAccess, (req, res) => {
  res.sendFile("make.html", routeOptions);
});

// @route     Get /discount
// @desc
// @access    Admin
router.get("/discount", adminAccess, (req, res) => {
  res.sendFile("discount.html", routeOptions);
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
