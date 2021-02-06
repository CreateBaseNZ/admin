/* ==========================================================
MODULES
========================================================== */

const mongoose = require("mongoose");
const gridFsStream = require("gridfs-stream");

/* ==========================================================
VARIABLES
========================================================== */

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let GridFS;

/* ==========================================================
SETUP GRIDFS
========================================================== */

mongoose.createConnection(process.env.MONGODB_URL,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) throw error;

    GridFS = gridFsStream(client.db, mongoose.mongo);
    GridFS.collection("fs");
  });

/* ==========================================================
EXPORT
========================================================== */

module.exports = GridFS;

/* ==========================================================
END
========================================================== */