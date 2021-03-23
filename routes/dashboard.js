/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");
const mongoose = require("mongoose");
const gridFsStream = require("gridfs-stream");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();
const upload = require("../configs/upload.js");
const email = require("../configs/email.js")

let GridFS;

mongoose.createConnection(process.env.MONGODB_URL,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) throw error;

    GridFS = gridFsStream(client.db, mongoose.mongo);
    GridFS.collection("fs");
  });

/*=========================================================================================
MODELS
=========================================================================================*/

const Mail = require("../models/Mail.js");

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

router.post("/dashboard/upload/image", upload.single("image"), verifiedContent, (req, res) => {
  // Delete old image
  // TO DO
  // Success handler
  return res.send({ status: "succeeded", content: "You successfully uploaded an image" });
});

router.post("/dashboard/send-global-email/new-subscriber", verifiedContent, async (req, res) => {
  // Fetch emails
  let mails;
  try {
    mails = await Mail.find();
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Filter emails who already received a new subscriber email
  let newMails = mails.filter(mail => {
    const index = mail.received.indexOf("newSubscriber");
    return (index === -1);
  });
  // Process each email
  let promises = [];
  for (let i = 0; i < newMails.length; i++) {
    let mail = newMails[i];
    const promise = new Promise(async (resolve, reject) => {
      const html = Mail.buildNewSubscriberEmail(mail);
      const subject = "Thank you for subscribing to CreateBase!";
      const emailAddress = mail.email;
      const text = "";
      const emailObject = email.build({ subject, html, email: emailAddress, text });
      try {
        await email.send(emailObject);
      } catch (error) {
        return reject(data);
      }
      mail.received.push("newSubscriber");
      try {
        await mail.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
      return resolve();
    });
    promises.push(promise);
  }
  try {
    await Promise.all(promises);
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: "emails sent successfully!" });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
