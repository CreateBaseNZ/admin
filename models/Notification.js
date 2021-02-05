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

const NotificationSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: [String], required: true },
  date: { 
    inboxed: { type: String, required: true },
    archived: { type: String, default: "" },
    binned: { type: String, default: "" }
  },
  opened: { type: Boolean, required: true },
  status: { type: String, required: true }
});

/* ==========================================================
MIDDLEWARE
========================================================== */



/* ==========================================================
STATICS
========================================================== */

NotificationSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // VALIDATION

    // CREATE NOTIFICATION
    const notification = new this(object);
    if (save) {
      try {
        await notification.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // SUCCESS HANDLER
    return resolve(notification);
  });
}

NotificationSchema.statics.reformStatus = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // Validation

    // Fetch the notification
    let notification;
    try {
      notification = await this.findOne({ _id: object.id, owner: object.owner });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Update the notification
    const date = moment().tz("Pacific/Auckland").format();
    if (object.status === "archive") {
      notification.date.archived = date;
    } else if (object.status === "bin") {
      notification.date.binned = date;
    }
    notification.status = object.status;
    // Save the notification
    if (save) {
      try {
        await notification.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    // Success handler
    return resolve(notification);
  });
}

/* ==========================================================
METHODS
========================================================== */



/* ==========================================================
EXPORT
========================================================== */

module.exports = Notification = mongoose.model("notifications", NotificationSchema);

/* ==========================================================
END
========================================================== */