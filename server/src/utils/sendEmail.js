const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter using our SMTP details (e.g. Gmail App Password, SendGrid, Mailtrap)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, 
        auth: {
            user: process.env.SMTP_USER, 
            pass: process.env.SMTP_PASS  
        }
    });

    // 2. Define the email options
    const message = {
        from: `"${process.env.FROM_NAME || 'NextPath'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    // 3. Force sending
    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
