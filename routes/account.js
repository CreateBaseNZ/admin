/* ==========================================================
MODULES
========================================================== */

const express = require("express");
const passport = require("passport");

/* ==========================================================
VARIABLES
========================================================== */

const router = new express.Router();

/* ==========================================================
MODELS
========================================================== */

const Account = require("../models/Account.js");
const User = require("../models/User.js");

/* ==========================================================
ROUTES
========================================================== */

// @route   POST /login/submit
// @desc
// @access  STRICTLY PUBLIC
router.post("/login/submit", passport.authenticate("local-account-login", {
  failureRedirect: "/"
}), (req, res) => {
  if (req.body.remember) {
    req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60 * 365);
  } else {
    req.session.cookie.expires = false;
  }
  if (req.user.verification.status) {
    return res.redirect("/dashboard");
  } else {
    return res.redirect("https://app.createbase.co.nz/verification");
  }
});

// @route   POST /login/validate
// @desc
// @access  STRICTLY PUBLIC
router.post("/login/validate", async (req, res) => {
  // Declare variables
  const email = req.body.email;
  const password = req.body.password;
  let error = { email: "", password: "" };
  // Validate the email
  let account;
  try {
    account = await Account.validateEmail(email);
  } catch (data) {
    if (data.status === "failed") {
      error.email = data.content;
      return res.send({ status: "failed", content: error });
    } else {
      return res.redirect("/"); // Ideally redirects to error page
    }
  }
  // Validate password
  let match;
  try {
    match = await account.validatePassword(password);
  } catch (data) {
    if (data.status === "failed") {
      error.password = data.content;
      return res.send({ status: "failed", content: error });
    } else {
      return res.redirect("/"); // Ideally redirects to error page
    }
  }
  if (!match) {
    error.password = "Invalid password";
    return res.send({ status: "failed", content: error });
  }
  // Validate if account is of type admin
  if (account.type !== "admin") {
    error.email = "This account is not authorised to access this domain."
    return res.send({ status: "failed", content: error });
  }
  // Success handler
  return res.send({ status: "succeeded", content: "" });
});

/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */