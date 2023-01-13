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
          <h2>Hi.</h2>
          <h4>This Is Your Link For Change Your Password</h4>
          <p style="margin-bottom: 30px;">Need to reset your password? just click <a href="${params.link}">Here</a> to reset Password. your password</p>
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
