import transporter, { emailTemplates } from '../config/email.js';

// Generate 6-digit verification code
export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
export const sendVerificationEmail = async (email, code, fullName) => {
    try {
        console.log('📧 Attempting to send verification email to:', email);
        console.log('🔑 Using email config:', {
            user: process.env.EMAIL_USER ? 'Set' : 'Missing',
            password: process.env.EMAIL_APP_PASSWORD ? 'Set' : 'Missing',
            service: 'gmail'
        });

        const template = emailTemplates.verification(code, fullName);
        
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: template.subject,
            html: template.html
        };

        console.log('📨 Mail options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Verification email sent successfully to:', email);
        console.log('📬 Send result:', result.messageId);
        return result;
    } catch (error) {
        console.error('❌ Failed to send verification email:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            stack: error.stack
        });
        throw new Error(`Failed to send verification email: ${error.message}`);
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