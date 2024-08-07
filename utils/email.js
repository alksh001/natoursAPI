const nodemailer = require('nodemailer');

const sendEmail = async(options) => {
    // create transporter
    const transporter = nodemailer.createTransport({
        // service: "Gmail",
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,

        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    // DEfine the email option 
    const mailOptions = {
        from: "Alok Singh <alok@abcd.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // send the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;