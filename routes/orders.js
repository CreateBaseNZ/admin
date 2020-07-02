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

const Order = require("../model/Order.js");
const Make = require("../model/Make.js");
const Customer = require("../model/Customer.js");

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
    return res.redirect("/verification");
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

// @route     GET /orders/fetch
// @desc      
// @access    CONTENT - VERIFIED - ADMIN
router.get("/orders/fetch", adminContent, async (req, res) => {
  // FETCH ORDERS
  let orders;
  try {
    orders = await Order.fetch({}, true);
  } catch (data) {
    return res.send(data);
  }
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: orders });
});

// @route     POST /orders/validated/save-make
// @desc      
// @access    CONTENT - VERIFIED - ADMIN
router.post("/orders/validated/save-make", adminContent, async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const makeId = req.body.makeId;
  const builtQuantity = req.body.quantity;
  // CREATE THE UPDATE OBJECT
  const update = { property: ["quantity", "built"], value: builtQuantity };
  // FETCH MAKE
  let make;
  try {
    make = await Make.findOne({ _id: makeId });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // UPDATE MAKE
  make.update([update]);
  // SAVE UPDATE
  try {
    await make.save();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: "successfully updated make" });
});

// @route     POST /orders/process-validated
// @desc      
// @access    CONTENT - VERIFIED - ADMIN
router.post("/orders/process-validated", adminContent, async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const orderId = req.body.orderId;
  // FETCH THE ORDER
  let order;
  try {
    order = await Order.findOne({ _id: orderId });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // PROCESS THE VALIDATED ORDER
  try {
    await order.processValidated();
  } catch (data) {
    return res.send(data);
  }
  // SAVE UPDATE
  try {
    await order.save();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: order });
});

// @route     POST /orders/save-tracking
// @desc      
// @access    CONTENT - VERIFIED - ADMIN
router.post("/orders/save-tracking", adminContent, async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const orderId = req.body.orderId;
  const tracking = req.body.tracking;
  // FETCH ORDER
  let order;
  try {
    order = await Order.findOne({ _id: orderId });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // UPDATE TRACKING
  order.shipping.tracking = tracking;
  // SAVE ORDER
  try {
    await order.save();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: order });
});

// @route     POST /orders/process-built
// @desc      
// @access    CONTENT - VERIFIED - ADMIN
router.post("/orders/process-built", adminContent, async (req, res) => {
  // DECLARE AND INITIALISE VARIABLES
  const orderId = req.body.orderId;
  // FETCH ORDER
  let order;
  try {
    order = await Order.findOne({ _id: orderId });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // PROCESS THE BUILT ORDER
  try {
    await order.processBuilt();
  } catch (data) {
    return res.send(data);
  }
  // SAVE UPDATE
  try {
    await order.save();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: order });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
