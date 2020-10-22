const nodemailer = require("nodemailer");
let hbs = require("nodemailer-express-handlebars");


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
  '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'
);


exports.sendVerifyEmail = (email, token) => {
  console.log(email, token);
  const msg = {
    to: email, // Change to your recipient
    from: 'adeniyitunji8@gmail.com', // Change to your verified sender
    subject: 'Welcome To Softkash',
    text: 'Soro soke! You need money just request or ask.',
    html: `<strong>Kindly use ${token} to confirm your email</strong>`,
  }
  sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent', msg)
  })
  .catch((error) => {
    console.error(error)
  })
}

exports.sendPasswordRest = (token, recipientEmail) => {
  let tokenLink = `http://localhost:4000/token/${token}`;
  emailEngine({view: "resetPassword", template: "resetPassword", 
    to: recipientEmail,
  subject: "Reset Password",
from: "starterpack@mail.com",
context: {tokenLink}})
}