/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const path = require("path");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();
const routeOptions = { root: path.join(__dirname, "../views") };

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

const strictlyPublicAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.type !== "admin") {
      req.logout();
      return res.redirect("/");
    } else {
      if (req.user.verification.status) {
        return res.redirect("/dashboard");
      } else {
        return res.redirect("https://app.createbase.co.nz/verification");
      }
    }
  } else {
    return next();
  }
}

const verifiedAccess = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.type !== "admin") {
      req.logout();
      return res.redirect("/");
    } else {
      if (req.user.verification.status) {
        return next();
      } else {
        return res.redirect("https://app.createbase.co.nz/verification");
      }
    }
  } else {
    return res.redirect("/");
  }
};

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     GET /
// @desc
// @access    PUBLIC
router.get("/", strictlyPublicAccess, (req, res) => res.sendFile("home.html", routeOptions));

// @route     GET /dashboard
// @desc
// @access    VERIFIED ADMIN
router.get("/dashboard", verifiedAccess, (req, res) => res.sendFile("dashboard.html", routeOptions));

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
