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
        console.log('✅ Verification email sent successfully to:', email);
        return result;
    } catch (error) {
        console.error('❌ Failed to send verification email:', error);
        throw new Error('Failed to send verification email');
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
        console.log('✅ Welcome email sent successfully to:', email);
    } catch (error) {
        console.error('❌ Failed to send welcome email:', error);
        // Don't throw error for welcome email failure
    }
};