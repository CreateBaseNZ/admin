/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();
const GridFS = require("../configs/gridfs.js");
const upload = require("../configs/upload.js");

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

const verifiedContent = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.type !== "admin") {
      return res.send({ status: "error", content: "You are not authorised to perform this action." });
    } else {
      if (req.user.verification.status) {
        return next();
      } else {
        return res.send({ status: "error", content: "Your account is not verified." });
      }
    }
  } else {
    return res.send({ status: "error", content: "You are not authorised to perform this action." });
  }
};

/*=========================================================================================
ROUTES
=========================================================================================*/

router.post("/dashboard/upload/default-avatar", upload.single("avatar"), verifiedContent, (req, res) => {
  // Delete old default avatar
  // TO DO
  // Success handler
  return res.send({ status: "succeeded", content: "You successfully uploaded a default avatar" });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
