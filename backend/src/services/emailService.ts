import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email: string, otp: string) => {

  console.log("Reached sendVerificationEmail!!!");
  
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


   const emailTemplate = `
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
     <div style="text-align: center; background-color: #4CAF50; color: white; padding: 10px; border-radius: 10px 10px 0 0;">
       <h1>Verify Your Email Address</h1>
     </div>
     <div style="padding: 20px;">
       <p style="font-size: 16px; color: #333;">
         Hello,
       </p>
       <p style="font-size: 16px; color: #333;">
         Thank you for registering with our app. Please use the verification code below to verify your email address.
       </p>
       <div style="text-align: center; margin: 20px 0;">
         <span style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; font-size: 20px; font-weight: bold;">
           ${otp}
         </span>
       </div>
       <p style="font-size: 16px; color: #333;">
         This code will expire in 10 minutes.
       </p>
       <p style="font-size: 16px; color: #333;">
         If you did not create an account, no further action is required.
       </p>
       <p style="font-size: 16px; color: #333;">
         Best regards,<br>
         LearnLink India
       </p>
     </div>
     <div style="text-align: center; background-color: #f2f2f2; color: #888; padding: 10px; border-radius: 0 0 10px 10px;">
       <p style="font-size: 12px;">&copy; 2024 LearnLink. All rights reserved.</p>
     </div>
   </div>
 `;


  let info = await transporter.sendMail({
    from: '"LearnLink" <noreply@learnlink.com>',
    to: email,
    subject: "Email Verification From LearnLink",
    text: `Your verification code is: ${otp}`,
    html: emailTemplate,
  });

  console.log("Message sent: %s", info.messageId);
}