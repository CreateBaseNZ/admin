/* ==========================================================
MODULES
========================================================== */

const nodemailer = require("nodemailer");
const inlineCSS = require("inline-css");

/* ==========================================================
VARIABLES
========================================================== */

if (process.env.NODE_ENV !== "production") require("dotenv").config();
let email = {
  send: undefined
};

/* ==========================================================
FUNCTIONS
========================================================== */

/**
 * Build the email object.
 * @param {Object} object 
 */
email.build = (object = {}) => {
  return new Promise(async (resolve, reject) => {
    // Combine the HTML and CSS
    const combined = object.html + object.css;
    // Inline the CSS
    const inlineCSSOptions = { url: "/" };
    let inline;
    try {
      inline = await inlineCSS(combined, inlineCSSOptions);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Return the email object
    return resolve({ email: object.email, subject: object.subject,
      text: object.text, html: inline });
  });
}

email.send = (object = {}) => {
  return new Promise(async (resolve, reject) => {
    const transporterOptions = {
      host: process.env.AWS_SMTP_HOST,
      port: process.env.AWS_SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.AWS_SMTP_USERNAME,
        pass: process.env.AWS_SMTP_PASSWORD
      }
    };
    const transporter = nodemailer.createTransport(transporterOptions);
    const message = {
      from: `"CreateBase" <${process.env.EMAIL_ADDRESS}>`,
      to: object.email,
      subject: object.subject,
      text: object.text,
      html: object.html
    };
    try {
      await transporter.sendMail(message);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    return resolve();
  });
};

/* ==========================================================
EXPORT
========================================================== */

module.exports = email;

/* ==========================================================
END
========================================================== */