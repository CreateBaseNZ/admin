/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();

/*=========================================================================================
MODELS
=========================================================================================*/

const Account = require("../model/Account.js");
const Transaction = require("../model/Transaction.js");

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

const adminAccess = (req, res, next) => {
  const account = req.user;
  // CHECK IF USER IS LOGGED IN
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  // CHECK IF USER IS NOT VERIFIED
  if (!account.verification.status) {
    return res.redirect("/");
  }
  // CHECK IF USER IS ADMIN
  if (account.type !== "admin") {
    return res.redirect("/");
  }
  // IF USER IS LOGGED IN, VERIFIED AND AN ADMIN
  return next();
};

const adminContent = (req, res, next) => {
  const account = req.user;
  // CHECK IF USER IS LOGGED IN
  if (!req.isAuthenticated()) {
    return res.send({ status: "failed", content: "user is not logged in" });
  }
  // CHECK IF USER IS NOT VERIFIED
  if (!account.verification.status) {
    return res.send({ status: "failed", content: "user is not verified" });
  }
  // CHECK IF USER IS ADMIN
  if (account.type !== "admin") {
    return res.send({ status: "failed", content: "user is not an admin" });
  }
  // IF USER IS LOGGED IN, VERIFIED AND AN ADMIN
  return next();
}

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route     POST /wallet/bankTransfer
// @desc      
// @access    CONTENT - VERIFIED - ADMIN
router.post("/wallet/bankTransfer", adminContent, async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const bankTransfer = req.body;
  // FETCH ACCOUNT WITH THE GIVEN WALLET CODE
  let account;
  try {
    account = await Account.findOne({ "wallet.code": bankTransfer.code });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // CREATE A BANK TRANSFER TICKET FOR THE GIVEN ACCOUNT
  let bankTransferDeposit, bankTransferBonus;
  try {
    [bankTransferDeposit, bankTransferBonus] =
      await Transaction.bankTransfer(account._id, bankTransfer.amount);
  } catch (error) {
    return res.send(error);
  }
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: "wallet top-up was successful" });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
