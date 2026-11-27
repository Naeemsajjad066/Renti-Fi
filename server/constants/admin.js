// constants/admin.js
// Admin-specific constants for dashboard, logging, and management operations.

// ─── Dashboard ────────────────────────────────────────────────────────────────

/** How many days back to look for "recent" activity on the dashboard */
export const ADMIN_RECENT_ACTIVITY_DAYS = 30;

/** How many recent users / bookings to show on the dashboard */
export const ADMIN_RECENT_ITEMS_LIMIT = 5;

// ─── Admin log pagination defaults ───────────────────────────────────────────

export const ADMIN_LOG_DEFAULT_LIMIT = 50;
export const ADMIN_LOG_DEFAULT_PAGE = 1;

// ─── AdminLog action strings ──────────────────────────────────────────────────

export const ADMIN_LOG_ACTIONS = {
  UPDATE_USER: 'UPDATE_USER',
  UPDATE_PROPERTY: 'UPDATE_PROPERTY',
  DELETE_PROPERTY: 'DELETE_PROPERTY',
  DELETE_USER: 'DELETE_USER',
};

// ─── AdminLog target type strings ────────────────────────────────────────────

export const ADMIN_LOG_TARGET_TYPES = {
  USER: 'User',
  PROPERTY: 'Property',
};
