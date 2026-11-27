// constants/user.js
// Auth, validation, and profile constants for user management.

// ─── Verification code types ──────────────────────────────────────────────────

export const VERIFICATION_CODE_TYPE = {
  EMAIL: 'email',
  PASSWORD_RESET: 'password_reset',
};

// ─── Token / code expiry ──────────────────────────────────────────────────────

/** Email verification code validity window (10 minutes) */
export const VERIFICATION_CODE_EXPIRY_MS = 10 * 60 * 1000;

/** Password-reset code validity window (15 minutes) */
export const PASSWORD_RESET_EXPIRY_MS = 15 * 60 * 1000;

/** Maximum failed attempts allowed on a verification code before it is locked */
export const MAX_VERIFICATION_ATTEMPTS = 5;

// ─── Password ─────────────────────────────────────────────────────────────────

/** Minimum accepted password length */
export const MIN_PASSWORD_LENGTH = 6;

/** bcrypt salt rounds */
export const BCRYPT_SALT_ROUNDS = 10;

// ─── Full name ────────────────────────────────────────────────────────────────

/** Minimum character count for a full name (after trimming) */
export const MIN_FULLNAME_LENGTH = 3;

// ─── Validation regexes ───────────────────────────────────────────────────────

/** Only letters and spaces — used for full name validation */
export const NAME_REGEX = /^[a-zA-Z\s]+$/;

/** Standard email format check */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Exactly 11 digits — Pakistani mobile numbers */
export const PHONE_REGEX_SIGNUP = /^[0-9]{11}$/;

/** Pakistani mobile with optional +92/0 prefix — used for profile updates */
export const PHONE_REGEX_UPDATE = /^(\+92|0)?[0-9]{10}$/;

/** 13-digit Pakistani CNIC (hyphens/spaces stripped before testing) */
export const ID_CARD_REGEX = /^[0-9]{13}$/;

// ─── Profile picture ──────────────────────────────────────────────────────────

/** Maximum accepted profile picture file size in bytes (4 MB) */
export const MAX_PROFILE_PIC_SIZE = 4 * 1024 * 1024;

/** Accepted image MIME sub-types for profile pictures */
export const ALLOWED_IMAGE_FORMATS = ['jpeg', 'jpg', 'png', 'webp'];

/** Cloudinary crop dimensions for profile pictures */
export const PROFILE_PIC_WIDTH = 400;
export const PROFILE_PIC_HEIGHT = 400;
