import { resend, emailEnabled, FROM_ADDRESS, emailTemplates } from '../config/email.js';

// Safe send wrapper — logs and returns null on failure, never throws
const safeSend = async (emailData, label = 'email') => {
  if (!emailEnabled) {
    console.warn(`⚠️  Email disabled — skipping "${label}" to ${emailData.to}`);
    return null;
  }

  try {
    const result = await resend.emails.send({
      from: emailData.from || FROM_ADDRESS,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    });
    
    console.log(`✅ ${label} sent to ${emailData.to} (ID: ${result.data?.id || 'unknown'})`);
    return result;
  } catch (error) {
    // Log but never propagate — email failure must not break the caller
    console.error(`❌ Failed to send ${label} to ${emailData.to}:`, error.message);
    
    // Provide helpful debugging for common Resend errors
    if (error.message.includes('Invalid domain')) {
      console.error('   → Check FROM_EMAIL domain is verified in Resend dashboard');
    } else if (error.message.includes('API key')) {
      console.error('   → Verify RESEND_API_KEY is correct');
    }
    
    return null;
  }
};

// Generate 6-digit verification code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationEmail = async (email, code, fullName) => {
  const template = emailTemplates.verification(code, fullName);
  return safeSend({
    to: email,
    subject: template.subject,
    html: template.html
  }, 'verification email');
};

export const sendPasswordResetEmail = async (email, resetCode, fullName) => {
  const template = emailTemplates.passwordReset(resetCode, fullName);
  return safeSend({
    to: email,
    subject: template.subject,
    html: template.html
  }, 'password reset email');
};

export const sendWelcomeEmail = async (email, user) => {
  const template = emailTemplates.welcome(user);
  return safeSend({
    to: email,
    subject: template.subject,
    html: template.html
  }, 'welcome email');
};

export const sendBookingConfirmationEmail = async (booking, property, user) => {
  const template = emailTemplates.bookingConfirmation(booking, property, user);
  return safeSend({
    to: user.email,
    subject: template.subject,
    html: template.html
  }, 'booking confirmation');
};

export const sendHostBookingNotification = async (booking, property, guest, host) => {
  const template = emailTemplates.hostBookingNotification(booking, property, guest, host);
  return safeSend({
    to: host.email,
    subject: template.subject,
    html: template.html
  }, 'host booking notification');
};

export const sendPropertyApprovalEmail = async (email, data) => {
  const template = emailTemplates.propertyApproval(data);
  return safeSend({
    to: email,
    subject: template.subject,
    html: template.html
  }, 'property approval');
};

export const sendPropertyRejectionEmail = async (email, data) => {
  const template = emailTemplates.propertyRejection(data);
  return safeSend({
    to: email,
    subject: template.subject,
    html: template.html
  }, 'property rejection');
};

// Generic email sender for custom emails (used by payment system)
export const sendEmail = async ({ to, subject, html, from = null }) => {
  return safeSend({
    to,
    subject,
    html,
    from: from || FROM_ADDRESS
  }, 'generic email');
};