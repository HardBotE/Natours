const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text'); // transforms the html to a text

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Jonas <${process.env.EMAIL_FROM}>`;
  }

  newTransport = function () {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }
    return nodemailer.createTransport({
      //everything here is received from nodemailer.
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  };

  send = async function (template, subject) {
    // 1) render HTML based on pug template
    const html = pug.renderFile(
      `${__dirname}/../view/email/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // 2) define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport to send email
    await this.newTransport().sendMail(mailOptions);
  };
  sendWelcome = async function () {
    await this.send('welcome', `Welcome to Natours ${this.firstName}!`);
  };

  sendPasswordReset= async function () {
    await this.send('passwordReset', `Your password reset token (valid for only 10 minutes)!`);
  }
};
module.exports={
  Email
}