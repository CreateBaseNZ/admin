/* ==========================================================
MODULES
========================================================== */

const mongoose = require("mongoose");
const moment = require("moment-timezone");

/* ==========================================================
VARIABLES
========================================================== */

const Schema = mongoose.Schema;

/* ==========================================================
OTHER MODELS
========================================================== */

/* ==========================================================
MODEL
========================================================== */

const MailSchema = new Schema({
  email: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId }
});

/* ==========================================================
MIDDLEWARE
========================================================== */

/* ==========================================================
STATICS
========================================================== */

MailSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // Validate input
    // Create mail
    let mail = new this(object);
    if (save) {
      try {
        await mail.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // Success handler
    return resolve(mail);
  });
}

MailSchema.statics.demolish = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // Find mail
    let mail;
    try {
      mail = this.findOne({ email: object.email });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Check if a mail was found
    if (!mail) return reject({ status: "failed", content: "The mail does not exist" });
    // Delete mail
    try {
      await mail.deleteOne();
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Success handler
    return resolve();
  });
}

MailSchema.statics.subscribe = function (object = {}) {
  return new Promise(async (resolve, reject) => {
    // Check if email is already subscribed
    let mail;
    try {
      mail = await this.findOne({ email: object.email });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Check if an account is inputted
    if (mail) {
      if (object.owner && (!mail.owner || mail.owner != object.owner)) {
        mail.owner = object.owner;
        // Save update
        try {
          await mail.save();
        } catch (error) {
          return reject({ status: "error", content: error });
        }
      }
      return reject({ status: "failed", content: "You are already subscribed" });
    }
    // If the mail doesn't exist build it
    try {
      await this.build(object);
    } catch (data) {
      return reject(data);
    }
    // Return success
    return resolve();
  });
}

MailSchema.statics.unsubscribe = function (object = {}) {
  return new Promise(async (resolve, reject) => {
    // Validate inputs
    // Delete mail
    try {
      await this.demolish(object);
    } catch (data) {
      return reject(data);
    }
    // Success handler
    return resolve();
  });
}

/* ==========================================================
METHODS
========================================================== */

/* ==========================================================
EXPORT
========================================================== */

module.exports = Mail = mongoose.model("mails", MailSchema);

/* ==========================================================
END
========================================================== */