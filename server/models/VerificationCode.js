import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['email_verification', 'password_reset'],
        default: 'email_verification'
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        index: { expireAfterSeconds: 0 }
    },
    attempts: {
        type: Number,
        default: 0,
        max: 5
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index to automatically delete expired documents
verificationCodeSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

const VerificationCode = mongoose.model("VerificationCode", verificationCodeSchema);
export default VerificationCode;