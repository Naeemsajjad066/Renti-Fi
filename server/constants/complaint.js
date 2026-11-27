// constants/complaint.js
// Enums and defaults for the complaint/report system.

// ─── Complaint status ─────────────────────────────────────────────────────────

export const COMPLAINT_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed',
};

// ─── Complaint priority ───────────────────────────────────────────────────────

export const COMPLAINT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// ─── Complaint category ───────────────────────────────────────────────────────

export const COMPLAINT_CATEGORY = {
  FRAUD: 'fraud',
  MISLEADING_LISTING: 'misleading_listing',
  SAFETY: 'safety',
  HARASSMENT: 'harassment',
  DAMAGE: 'damage',
  OTHER: 'other',
};

// ─── Pagination defaults ──────────────────────────────────────────────────────

export const COMPLAINT_DEFAULT_PAGE = 1;
export const COMPLAINT_DEFAULT_LIMIT = 20;

// ─── Runtime config (resolved from env at startup) ───────────────────────────

/**
 * Admin notification address.
 * Set ADMIN_EMAIL in .env — falls back to EMAIL_USER, then an empty string
 * so a missing env var produces a visible failure rather than a silent wrong send.
 */
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '';

/**
 * Base URL of the client app — used in admin complaint review links.
 * Set CLIENT_URL in .env.
 */
export const CLIENT_BASE_URL = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:8080';
