const nodemailer=require('nodemailer');

const  sendMailer=async options=>
{
  //Host a create transportnal az adott cim, adott protjara, user credentialokkal kudi a datat
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'Kovacs Roland <testadmin@io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

module.exports={sendMailer};