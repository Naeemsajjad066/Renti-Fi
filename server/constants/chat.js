// constants/chat.js
// All configuration for the RAG-powered chat controller.

// ─── OpenRouter ───────────────────────────────────────────────────────────────

export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/** Models tried in order; first success wins. */
export const CHAT_MODELS = [
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'liquid/lfm-3-1.7b:free',
];

// ─── Limits ───────────────────────────────────────────────────────────────────

/** Maximum conversation turns kept in context (each turn = 1 user + 1 assistant msg) */
export const MAX_HISTORY_TURNS = 6;

/** Maximum characters accepted from a single user message */
export const MAX_MESSAGE_LENGTH = 500;

/** Maximum tokens the LLM may return */
export const MAX_REPLY_TOKENS = 512;

/** How many property results the RAG search may return */
export const MAX_PROPERTY_RESULTS = 4;

// ─── Retry ───────────────────────────────────────────────────────────────────

export const MAX_RETRIES = 2;

/** Milliseconds to wait between retries on 429 responses */
export const RETRY_DELAY_MS = 3000;

// ─── Property search ─────────────────────────────────────────────────────────

/** Pakistani cities recognised for property search intent detection */
// prettier-ignore
export const KNOWN_CITIES = [
  'lahore', 'karachi', 'islamabad', 'rawalpindi', 'faisalabad', 'multan',
  'peshawar', 'quetta', 'sialkot', 'gujranwala', 'hyderabad', 'abbottabad',
  'murree', 'swat', 'hunza', 'naran', 'kaghan', 'gilgit', 'skardu',
];

/** Keywords that indicate the user wants to find or book a property */
// prettier-ignore
export const SEARCH_INTENT_KEYWORDS = [
  'find', 'search', 'show', 'list', 'get', 'suggest', 'recommend',
  'available', 'book', 'rent', 'stay', 'looking for', 'want to',
  'property', 'properties', 'listing', 'listings', 'place', 'places',
  'apartment', 'house', 'villa', 'cabin',
];

// ─── Sensitive data patterns ──────────────────────────────────────────────────

/**
 * Patterns stripped from conversation *history* before sending to the LLM.
 * Intentionally excludes long numbers so prices like "Rs 15000" are preserved.
 */
export const HISTORY_SENSITIVE_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // email addresses
  /bearer\s+[a-z0-9._-]+/gi,                                // JWT tokens
  /password\s*[:=]\s*\S+/gi,                                // password key-value pairs
];

/**
 * Patterns stripped from the *current* user message before sending to the LLM.
 * More aggressive — also redacts very long numeric IDs.
 */
export const MESSAGE_SENSITIVE_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // emails
  /\b\d{8,}\b/g,                                            // 8+ digit IDs
  /bearer\s+[a-z0-9._-]+/gi,
  /password\s*[:=]\s*\S+/gi,
];
