/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const mongoose = require("mongoose");
const moment = require("moment-timezone");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const Schema = mongoose.Schema;

/*=========================================================================================
EXTERNAL MODELS
=========================================================================================*/

const Customer = require("./Customer.js");

/*=========================================================================================
CREATE COMMENT MODEL
=========================================================================================*/

const CommentSchema = new Schema({
  accountId: { type: Schema.Types.ObjectId },
  sessionId: { type: Schema.Types.ObjectId },
  message: { type: String, default: "" },
  date: {
    created: { type: String, default: "" },
    modified: { type: String, default: "" }
  },
  attachments: { type: [Schema.Types.ObjectId], default: [] }
});

/*=========================================================================================
MIDDLEWARE
=========================================================================================*/

CommentSchema.pre("save", async function (next) {
  const date = moment().tz("Pacific/Auckland").format();
  // update the date modified property
  if (this.isModified()) this.date.modified = date;
  if (this.isNew) this.date.created = date;
  next();
});

/*=========================================================================================
STATIC
=========================================================================================*/

// @FUNC  build
// @TYPE  STATICS
// @DESC  
CommentSchema.statics.build = function (object = {}, save = true) {
  return new Promise(async (resolve, reject) => {
    // TO DO .....
    // VALIDATE EACH PROPERTY
    // TO DO .....
    // CREATE THE DOCUMENT
    let comment = new this(object);
    if (save) {
      try {
        comment = await comment.save();
      } catch (error) {
        return reject({ status: "error", content: error });
      }
    }
    return resolve(comment);
  });
}

// @FUNC  fetch
// @TYPE  STATICS
// @DESC
CommentSchema.statics.fetch = function (query = {}) {
  return new Promise(async (resolve, reject) => {
    // GET COMMENTS
    let comments;
    try {
      comments = await this.find(query);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // GET USERS
    let customerIds = [];
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      const customerId = comment.accountId;
      if (customerIds.indexOf(customerId) === -1) customerIds.push(customerId);
    }
    let customers;
    try {
      customers = await Customer.find({ accountId: customerIds });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // CONSTRUCT THE FORMATTED COMMENTS
    let formattedComments = [];
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      const customer = customers.find(customer => (String(comment.accountId) == String(customer.accountId)));
      let author = { id: "unknown", name: "unknown", picture: "unknown" };
      if (customer) author = { id: customer.accountId, name: customer.displayName, picture: customer.picture };
      const formattedComment = {
        id: comment._id, author, message: comment.message,
        date: comment.date, attachments: comment.attachments
      }
      formattedComments.push(formattedComment);
    }
    // SUCCESS HANDLER
    return resolve(formattedComments);
  });
}

/*=========================================================================================
METHODS
=========================================================================================*/

CommentSchema.methods.setDate = function () {
  return new Promise(async (resolve, reject) => {
    const date = moment()
      .tz("Pacific/Auckland")
      .format();

    this.date.created = date;
    this.date.modified = date;

    let savedComment;

    try {
      savedComment = await this.save();
    } catch (error) {
      reject(error);
    }

    resolve(savedComment);
  });
};

CommentSchema.methods.updateDate = function () {
  return new Promise(async (resolve, reject) => {
    const date = moment()
      .tz("Pacific/Auckland")
      .format();

    this.date.modified = date;

    let savedComment;

    try {
      savedComment = await this.save();
    } catch (error) {
      reject(error);
    }

    resolve(savedComment);
  });
};

/*=========================================================================================
EXPORT COMMENT MODEL
=========================================================================================*/

module.exports = Comment = mongoose.model("comment", CommentSchema);

/*=========================================================================================
END
=========================================================================================*/
