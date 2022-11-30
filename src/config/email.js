require("dotenv").config();

const MAIL_SETTINGS = {
  // auth: {
  //   user: process.env.MAIL_EMAIL,
  //   pass: process.env.MAIL_PASSWORD,
  // },
  service: "gmail",
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
};

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

module.exports.sendMails = async (params) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: "Reset Password Verification",
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Hi ${params.name}.</h2>
          <h4>This Is Your Code Verification</h4>
          <p style="margin-bottom: 30px;">Please enter the OTP on input to reset your password</p>
          <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
     </div>
      `,
    });
    return;
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports.sendVerifMail = async (params, pin) => {
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: "Verification Your Email !",
      html: `
        <div
          class="container"
          style="max-width: 90%; margin: auto; padding-top: 20px"
        >
          <h2>Hi.</h2>
          <h4>This Is Your Link Verification</h4>
          <p style="margin-bottom: 30px;">Please click <a href="${process.env.LINK_DEPLOYMENT}${params.OTP}">here</a> to verif your email</p>
     </div>
      `,
    });
    return;
  } catch (error) {
    console.log(error);
    return false;
  }
};
