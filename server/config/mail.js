'use strict'
var  mailer = require("nodemailer");

require('dotenv/config');

module.exports = async (account,subject, message) => {

  let transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let info = await transporter.sendMail({
    from: `Happy Hours <noreply@happyhours.com>`,
    to: account,
    subject: subject,
    html: message
  });

  console.log("Message sent: %s", info.messageId);
}
