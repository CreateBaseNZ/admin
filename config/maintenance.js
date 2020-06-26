/*=========================================================================================
EXPORT
=========================================================================================*/

module.exports = async () => {

  /*=======================================================================================
  REQUIRED MODULES
  =======================================================================================*/

  const moment = require("moment-timezone");

  /*=======================================================================================
  MODELS
  =======================================================================================*/

  const Account = require("../model/Account.js");
  const Chunk = require("../model/Chunk.js");
  const Comment = require("../model/Comment.js");
  const Customer = require("../model/Customer.js");
  const Discount = require("../model/Discount.js");
  const File = require("../model/File.js");
  const Image = require("../model/Image.js");
  const Mail = require("../model/Mail.js");
  const Make = require("../model/Make.js");
  const Order = require("../model/Order.js");
  const Project = require("../model/Project.js");
  const Session = require("../model/Session.js");
  const Transaction = require("../model/Transaction.js");

  /*=======================================================================================
  FUNCTIONS
  =======================================================================================*/

  /*=======================================================================================
  INITIALISATION
  =======================================================================================*/

  /*=======================================================================================
  SET PERIODIC FUNCTION CALLS
  =======================================================================================*/

  const seconds = 0;
  const minutes = 0;
  const hours = 12;
  const days = 0;
  const period = ((seconds) + (60 * minutes) + (60 * 60 * hours) + (24 * 60 * 60 * days)) * 1000;

  setInterval(() => {

  }, period);
}

/*=========================================================================================
END
=========================================================================================*/