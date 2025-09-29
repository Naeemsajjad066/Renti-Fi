import transporter, { emailTemplates } from '../config/email.js';

// Generate 6-digit verification code
export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
export const sendVerificationEmail = async (email, code, fullName) => {
    try {
        const template = emailTemplates.verification(code, fullName);
        
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: template.subject,
            html: template.html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('📧 Verification email sent to:', email);
        return result;
    } catch (error) {
        console.error('❌ Email send failed:', error.message);
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetCode, fullName) => {
    try {
        const template = emailTemplates.passwordReset(resetCode, fullName);
        
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: template.subject,
            html: template.html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('🔒 Password reset email sent to:', email);
        return result;
    } catch (error) {
        console.error('❌ Reset email failed:', error.message);
        throw new Error(`Failed to send password reset email: ${error.message}`);
    }
};

// Send welcome email
export const sendWelcomeEmail = async (email, user) => {
    try {
        const template = emailTemplates.welcome(user);
        
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: template.subject,
            html: template.html
        };

        await transporter.sendMail(mailOptions);
        console.log('🎉 Welcome email sent to:', email);
    } catch (error) {
        console.error('❌ Welcome email failed:', error.message);
        // Don't throw error for welcome email failure
    }
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (booking, property, user) => {
    try {
        const template = emailTemplates.bookingConfirmation(booking, property, user);
        
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: user.email,
            subject: template.subject,
            html: template.html
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Booking confirmation email sent to:', user.email);
    } catch (error) {
        console.error('❌ Booking confirmation email failed:', error.message);
        throw new Error(`Failed to send booking confirmation email: ${error.message}`);
    }
};