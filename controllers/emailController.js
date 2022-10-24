require('dotenv').config();
const mailgun = require('mailgun-js');

exports.sendEmail = (email, inviterEmail, documentTitle) =>
  new Promise((resolve, reject) => {
    const data = {
        from: 'ABC Editor <abc@editor.com>',
        to: email,
        subject: 'ABC Editor',
        html: `<div><p>User ${inviterEmail} has invited you to edit a document, ${documentTitle}, in ABC Editor</p><a href="https://www.student.bth.se/~veax20/editor/">Don't have an account? Click here to register</a></div>`
    };

    mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN }).messages().send(data, (error) => {
      if (error) {
        return reject(new Error('Error in sending email.'));
      }
      return resolve();
    });
  });