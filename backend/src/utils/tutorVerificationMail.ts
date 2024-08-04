import nodemailer from 'nodemailer';

export const sendTutorApprovalEmail = async (email: string, isApproved: boolean) => {
  console.log("Reached sendTutorApprovalEmail!!!");
  
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject = isApproved ? "You are approved as a tutor" : "Your tutor application has been declined";
  
  const emailTemplate = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
    <div style="text-align: center; background-color: ${isApproved ? '#4CAF50' : '#f44336'}; color: white; padding: 10px; border-radius: 10px 10px 0 0;">
      <h1>${subject}</h1>
    </div>
    <div style="padding: 20px;">
      <p style="font-size: 16px; color: #333;">
        Hello,
      </p>
      ${isApproved ? `
        <p style="font-size: 16px; color: #333;">
          Congratulations! You have been approved as a tutor on LearnLink India.
        </p>
        <p style="font-size: 16px; color: #333;">
          You can now log in to your account and start offering your services.
        </p>
      ` : `
        <p style="font-size: 16px; color: #333;">
          We regret to inform you that your tutor application has been declined.
        </p>
        <p style="font-size: 16px; color: #333;">
          If you have any questions, please contact our support team.
        </p>
      `}
      <p style="font-size: 16px; color: #333;">
        Best regards,<br>
        LearnLink India Team
      </p>
    </div>
    <div style="text-align: center; background-color: #f2f2f2; color: #888; padding: 10px; border-radius: 0 0 10px 10px;">
      <p style="font-size: 12px;">&copy; 2024 LearnLink. All rights reserved.</p>
    </div>
  </div>
  `;

  try {
    let info = await transporter.sendMail({
      from: '"LearnLink" <noreply@learnlink.com>',
      to: email,
      subject: subject,
      html: emailTemplate,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; 
  }
}