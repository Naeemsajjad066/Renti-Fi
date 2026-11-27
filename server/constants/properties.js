// constants/properties.js
// Numbers and config specific to property management.

/** Cache-Control max-age for the property list endpoint (seconds) */
export const PROPERTY_LIST_CACHE_MAX_AGE = 300; // 5 minutes

/** Cache-Control max-age for a single property endpoint (seconds) */
export const PROPERTY_DETAIL_CACHE_MAX_AGE = 600; // 10 minutes

/** How many featured properties to return on the homepage */
export const FEATURED_PROPERTIES_LIMIT = 6;

/** Default admin placeholder ID card value used when seeding admin users */
export const DEFAULT_ADMIN_ID_CARD = '0000000000000';

/** Default admin placeholder phone number used when seeding admin users */
export const DEFAULT_ADMIN_PHONE = '00000000000';
