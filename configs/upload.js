/* ==========================================================
MODULES
========================================================== */

if (process.env.NODE_ENV !== "production") require("dotenv").config();
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

/* ==========================================================
SETUP UPLOAD
========================================================== */

const storage = new GridFsStorage({
  url: process.env.MONGODB_URL,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: file.originalname,
      contentType: file.mimetype
    }
  }
});

const upload = multer({ storage });

/* ==========================================================
EXPORT
========================================================== */

module.exports = upload;

/* ==========================================================
END
========================================================== */