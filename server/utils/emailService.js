// utils/emailService.js
import transporter, { emailTemplates } from '../config/email.js';

// Send email
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      html
    };
    
    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  const template = emailTemplates.welcome(user);
  return await sendEmail(user.email, template.subject, template.html);
};

// Send booking confirmation email
export const sendBookingConfirmation = async (booking, property, user) => {
  const template = emailTemplates.bookingConfirmation(booking, property, user);
  return await sendEmail(user.email, template.subject, template.html);
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetToken) => {
  const template = emailTemplates.passwordReset(user, resetToken);
  return await sendEmail(user.email, template.subject, template.html);
};

// Send host verification email
export const sendHostVerificationEmail = async (user, status) => {
  const subject = `Host Verification ${status === 'approved' ? 'Approved' : 'Rejected'}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Host Verification ${status === 'approved' ? 'Approved' : 'Rejected'}</h2>
      <p>Hello ${user.fullName},</p>
      <p>Your host verification request has been <strong>${status}</strong>.</p>
      ${status === 'rejected' ? '<p>Please check your documents and submit again.</p>' : ''}
      <br>
      <p>Best regards,<br>The Rentifi Team</p>
    </div>
  `;
  
  return await sendEmail(user.email, subject, html);
};