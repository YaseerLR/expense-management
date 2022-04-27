const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "a5cee4b85d8781",
        pass: "64d75fc684958b"
    }
});

module.exports = { transporter };