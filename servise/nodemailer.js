const nodemailer = require('nodemailer');

const {EMAIL_USERNAME, EMAIL_PASSWORD} = require('../evn')
require('dotenv').config();

const config = {
  host: 'smtp.meta.ua',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  }, 
};

const transporter = nodemailer.createTransport(config);


const sendEmail = async(data)=>{
    const email = { ...data, from: EMAIL_USERNAME,};
    await transporter.sendMail(email).then((data) => console.log(data)).catch((error) => console.log(error.message));
}

module.exports = {
  sendEmail
}
