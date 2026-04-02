const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

exports.sendCredentials = async (email, name, password) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Welcome to DOMUSONE - Your Login Credentials',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <img src="https://yourdomain.com/logo.png" alt="DOMUSONE" style="max-width: 150px;">
        <h2 style="color: #FF6B35;">Welcome to DOMUSONE, ${name}!</h2>
        <p>Your landlord has created an account for you. Here are your login credentials:</p>
        <div style="background: #FFF4E6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        <p>Please login and change your password immediately.</p>
        <a href="https://yourdomusoneapp.com/login" style="background: #FF6B35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">This is an automated message, please do not reply.</p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};
