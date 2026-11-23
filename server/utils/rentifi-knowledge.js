/**
 * RentiFi RAG Knowledge Base
 *
 * Plain-text chunks describing every feature, flow, and policy on the platform.
 * The chat controller retrieves the most relevant chunks via keyword matching
 * and injects them as context into the LLM prompt — no personal data is stored here.
 *
 * HOW TO EXTEND: add a new entry to the `knowledgeChunks` array.
 * Keep each chunk focused on ONE topic so retrieval stays precise.
 */

export const knowledgeChunks = [
  // ─── GENERAL PLATFORM ────────────────────────────────────────────────────
  {
    id: 'platform-overview',
    tags: ['about', 'rentifi', 'platform', 'overview', 'what is'],
    text: `RentiFi is a property rental marketplace that connects property hosts with guests looking for short- or long-term stays.
Hosts can list properties, manage bookings, and receive payments via Stripe.
Guests can search properties, book stays, make payments, and leave reviews.
The platform supports three account roles: guest (default), host, and admin.`,
  },

  // ─── ACCOUNT & AUTH ───────────────────────────────────────────────────────
  {
    id: 'signup',
    tags: ['sign up', 'register', 'create account', 'new account', 'registration'],
    text: `To create a RentiFi account:
1. Click "Sign Up" on the homepage or navigation bar.
2. Fill in your full name, email address, ID card number, phone number, and password (minimum 6 characters).
3. Submit the form — a verification code is sent to your email.
4. Enter the verification code on the Email Verification page to activate your account.
Your account starts as a "guest" role. You can become a host by applying from your profile settings.`,
  },
  {
    id: 'login',
    tags: ['log in', 'login', 'sign in', 'access account'],
    text: `To log in to RentiFi:
1. Click "Login" in the navigation bar.
2. Enter your registered email address and password.
3. Click "Login". You will be redirected to the homepage on success.
If you forgot your password, click "Forgot Password" on the login page.`,
  },
  {
    id: 'forgot-password',
    tags: ['forgot password', 'reset password', 'change password', 'password recovery'],
    text: `To reset a forgotten password:
1. Go to the Login page and click "Forgot Password".
2. Enter your registered email address and submit.
3. Check your email for a reset link or code.
4. Follow the instructions in the email to set a new password.
Password reset is limited to 3 attempts per hour for security.`,
  },
  {
    id: 'email-verification',
    tags: ['verify email', 'email verification', 'verification code', 'confirm email'],
    text: `After signing up, RentiFi sends a verification code to your email.
Enter that code on the Email Verification page within the allotted time.
If the code expires or you did not receive it, use the "Resend Code" option.
Your account cannot be used until your email is verified.`,
  },
  {
    id: 'profile',
    tags: ['profile', 'edit profile', 'update profile', 'bio', 'profile picture', 'photo'],
    text: `To view or edit your profile:
1. Click your avatar or name in the navigation bar and select "Profile".
2. You can update your full name, bio, and profile picture.
3. Profile pictures are uploaded to Cloudinary — keep them under 4 MB.
4. Changes are saved immediately when you submit the form.`,
  },
  {
    id: 'settings',
    tags: ['settings', 'account settings', 'preferences', 'notifications'],
    text: `The Settings page lets you manage your account preferences.
Guests access Settings from the navigation menu.
Hosts have a dedicated Host Settings page under the host dashboard.
You can update notification preferences, account details, and security settings there.`,
  },
  {
    id: 'roles',
    tags: ['role', 'guest', 'host', 'admin', 'account type', 'become host'],
    text: `RentiFi has three account roles:
- Guest (default): Can search, view, and book properties; leave reviews.
- Host: Can do everything a guest can, plus list and manage properties, receive payouts.
- Admin: Platform administrators who manage users, properties, and complaints.
To become a host, apply from your profile or settings page. The application may require ID verification.`,
  },

  // ─── SEARCHING & BROWSING ─────────────────────────────────────────────────
  {
    id: 'search-properties',
    tags: ['search', 'find property', 'browse', 'explore', 'filter', 'location'],
    text: `To search for properties:
1. Use the search bar on the homepage or go to the "Properties" page.
2. Enter a location or keyword.
3. Use filters to narrow by price range, property type, number of guests, amenities, and dates.
4. Results show as a grid of property cards with key details.
5. Click any card to view full property details, photos, amenities, host info, reviews, and availability.`,
  },
  {
    id: 'property-types',
    tags: ['property type', 'apartment', 'house', 'villa', 'room', 'cabin', 'categories'],
    text: `RentiFi supports multiple property types including apartments, houses, villas, rooms, studios, and cabins.
You can filter by property type on the Properties page or use the category filter on the homepage.`,
  },
  {
    id: 'property-details',
    tags: ['property details', 'amenities', 'photos', 'description', 'rules', 'check-in', 'check-out'],
    text: `Each property listing page shows:
- Photo gallery
- Title, description, and location
- Price per night
- Amenities (WiFi, parking, pool, kitchen, etc.)
- House rules (check-in/check-out times, pet policy, smoking policy)
- Host profile and contact info
- Guest reviews and average rating
- Availability calendar
- Booking form to select dates and number of guests`,
  },

  // ─── BOOKINGS (GUEST) ─────────────────────────────────────────────────────
  {
    id: 'make-booking',
    tags: ['book', 'booking', 'reserve', 'make reservation', 'how to book'],
    text: `To book a property:
1. Open the property listing page.
2. Select your check-in and check-out dates on the availability calendar.
3. Enter the number of guests.
4. Click "Book Now" or "Reserve".
5. Review the booking summary (total cost, dates, fees).
6. Choose your payment method and complete payment via Stripe.
7. You will receive a booking confirmation email.
Your booking appears in "My Bookings" on your profile.`,
  },
  {
    id: 'booking-status',
    tags: ['booking status', 'pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
    text: `A booking can have the following statuses:
- Pending: Waiting for host confirmation.
- Confirmed: Host has accepted the booking.
- Cancelled: Booking was cancelled by the guest or host.
- Completed: Stay has ended.
- Rejected: Host declined the booking request.
You can track your booking status on the "My Bookings" page or the individual Booking Details page.`,
  },
  {
    id: 'cancel-booking',
    tags: ['cancel booking', 'cancellation', 'refund', 'cancel reservation'],
    text: `To cancel a booking:
1. Go to "My Bookings" and open the booking you want to cancel.
2. Click "Cancel Booking".
3. Confirm the cancellation.
Refund eligibility depends on the host's cancellation policy shown on the listing.
Cancellations and refunds are processed through Stripe.`,
  },
  {
    id: 'booking-details',
    tags: ['booking details', 'booking info', 'reservation details', 'booking summary'],
    text: `The Booking Details page shows:
- Property name and location
- Check-in and check-out dates
- Total cost breakdown (nightly rate × nights + fees)
- Booking status
- Payment summary
- Host contact information
Access it via "My Bookings" and clicking any booking.`,
  },
  {
    id: 'payment',
    tags: ['payment', 'pay', 'stripe', 'credit card', 'checkout', 'transaction'],
    text: `RentiFi uses Stripe for secure payment processing.
You can pay with any major credit or debit card.
Payments are processed at the time of booking confirmation.
Your card details are handled entirely by Stripe — RentiFi never stores card numbers.
After a successful payment you receive a confirmation email and the booking appears in "My Bookings".`,
  },
  {
    id: 'reviews',
    tags: ['review', 'rating', 'leave review', 'write review', 'feedback'],
    text: `After completing a stay, guests can leave a review for the property:
1. Go to "My Bookings" and open the completed booking.
2. Click "Leave a Review".
3. Rate the property (1–5 stars) and write a comment.
4. Submit — the review appears on the property listing.
Only guests who completed a stay can review that property.`,
  },

  // ─── HOST FEATURES ────────────────────────────────────────────────────────
  {
    id: 'become-host',
    tags: ['become host', 'host account', 'list property', 'hosting', 'apply host'],
    text: `To become a host on RentiFi:
1. Log into your account.
2. Go to Settings and find the "Become a Host" option, or click "List Your Property".
3. Complete the host application — this may require identity verification.
4. Once approved, your account role changes to "host" and you gain access to the Host Dashboard.
5. Connect your Stripe account to receive payouts (required before publishing a listing).`,
  },
  {
    id: 'add-listing',
    tags: ['add listing', 'create listing', 'new listing', 'list property', 'add property'],
    text: `To add a new property listing:
1. From the Host Dashboard, click "Add Listing" or go to /host/add-listing.
2. Fill in the listing form:
   - Title, description, property type
   - Location (address, city, country)
   - Price per night
   - Number of bedrooms, bathrooms, max guests
   - Amenities (select from the list)
   - House rules, check-in/check-out times
3. Upload at least one photo (up to 4 MB per image).
4. Submit for review — an admin verifies the listing before it goes live.`,
  },
  {
    id: 'edit-listing',
    tags: ['edit listing', 'update listing', 'change listing', 'modify property', 'update property'],
    text: `To edit an existing listing:
1. Go to Host Dashboard → My Properties.
2. Click on the property you want to edit.
3. Click "Edit" and update any fields.
4. Save changes. Some changes may require re-verification by an admin.`,
  },
  {
    id: 'host-dashboard',
    tags: ['host dashboard', 'dashboard', 'host panel', 'host overview', 'earnings'],
    text: `The Host Dashboard (at /host/dashboard) gives hosts a central view of:
- Recent bookings and their statuses
- Pending booking requests
- Property listings overview
- Earnings and payout summary
- Quick links to manage properties, bookings, and settings`,
  },
  {
    id: 'host-bookings',
    tags: ['host bookings', 'manage bookings', 'booking requests', 'accept booking', 'reject booking'],
    text: `To manage booking requests as a host:
1. Go to Host Dashboard → Bookings (at /host/bookings).
2. You will see all bookings for your properties.
3. For pending bookings, you can Accept or Reject the request.
4. Accepted bookings move to "Confirmed" status and payment is captured.
5. Click any booking row to see full Booking Details.`,
  },
  {
    id: 'host-properties',
    tags: ['my properties', 'host properties', 'manage properties', 'property list'],
    text: `The My Properties page (at /host/properties) lists all your property listings.
From here you can:
- View each property's status (pending verification, active, inactive)
- Edit a listing
- Deactivate or delete a listing
- See quick stats like total bookings per property`,
  },
  {
    id: 'stripe-connect',
    tags: ['stripe connect', 'payout', 'bank account', 'receive money', 'withdraw', 'payments setup', 'connect stripe'],
    text: `Hosts must connect a Stripe account to receive payouts:
1. From Host Settings or Dashboard, click "Connect Stripe" or "Setup Payouts".
2. You will be redirected to Stripe's onboarding flow.
3. Enter your bank account details and identity information on Stripe's secure pages.
4. Once onboarding is complete, you will be redirected back to RentiFi.
5. Payouts are automatically transferred to your bank account after a stay is completed.
If your Stripe connection is in a "restricted" state, check your Stripe dashboard for required actions.`,
  },
  {
    id: 'host-settings',
    tags: ['host settings', 'host preferences', 'host profile', 'host account'],
    text: `Host Settings (at /host/settings) lets hosts manage:
- Public host profile (bio, photo)
- Payout (Stripe Connect) setup
- Notification preferences
- Account security`,
  },

  // ─── PROPERTY VERIFICATION ────────────────────────────────────────────────
  {
    id: 'property-verification',
    tags: ['verification', 'property approval', 'pending verification', 'listing review', 'approved'],
    text: `All new property listings are reviewed by a RentiFi admin before going live.
The review process typically checks for:
- Accurate description and photos
- Valid location
- Compliance with platform policies
Listings in "Pending Verification" are not visible to guests yet.
You will receive an email once your listing is approved or if changes are required.`,
  },

  // ─── REVIEWS & RATINGS ───────────────────────────────────────────────────
  {
    id: 'review-policy',
    tags: ['review policy', 'fake reviews', 'report review', 'review guidelines'],
    text: `RentiFi's review policy:
- Only guests who completed a confirmed stay can review a property.
- Reviews must be honest and based on personal experience.
- Do not include personal information (names, contact details) in reviews.
- Abusive, spam, or misleading reviews will be removed by admins.
- If you believe a review is fraudulent, report it via the complaints system.`,
  },

  // ─── COMPLAINTS & REPORTS ────────────────────────────────────────────────
  {
    id: 'complaints',
    tags: ['complaint', 'report', 'issue', 'dispute', 'problem', 'report property', 'report user'],
    text: `To file a complaint or report an issue:
1. Go to the property listing or booking in question.
2. Click "Report" or "File a Complaint".
3. Describe the issue in detail and submit.
4. RentiFi admins review all complaints and will follow up via email.
Complaints are handled confidentially. Personal details are only shared as required to resolve the issue.`,
  },

  // ─── SAFETY & PRIVACY ────────────────────────────────────────────────────
  {
    id: 'privacy',
    tags: ['privacy', 'data', 'personal information', 'gdpr', 'data protection', 'security'],
    text: `RentiFi takes your privacy seriously:
- Personal data (name, email, ID, phone) is stored securely and never sold to third parties.
- Payments are processed by Stripe — RentiFi does not store card numbers.
- Identity documents are used for verification only.
- You can review our full Privacy Policy at /privacy-policy.
- To request data deletion, contact support.`,
  },
  {
    id: 'account-security',
    tags: ['security', 'account security', 'hacked', 'suspicious activity', 'protect account'],
    text: `To keep your RentiFi account secure:
- Use a strong, unique password (at least 6 characters, mix letters and numbers).
- Never share your password or verification codes with anyone.
- If you suspect unauthorised access, change your password immediately via Forgot Password.
- RentiFi staff will never ask for your password.
- If you notice suspicious activity, contact support immediately.`,
  },

  // ─── SUPPORT ─────────────────────────────────────────────────────────────
  {
    id: 'contact-support',
    tags: ['support', 'contact', 'help', 'customer service', 'email support', 'email', 'phone', 'number', 'reach', 'live chat', 'contact email', 'contact number'],
    text: `RentiFi support contact details:
- Email: rentifi.project@gmail.com
- Phone: 0371-3324066
- Response times are typically within 1–2 business days.

Use this chat assistant for instant answers about how RentiFi works.
For account-specific issues (blocked account, payment disputes, ID verification), email us directly at rentifi.project@gmail.com or call 0371-3324066.
For urgent safety concerns, use the Complaints system to escalate to an admin.`,
  },

  // ─── PAYMENTS & FEES ─────────────────────────────────────────────────────
  {
    id: 'fees',
    tags: ['fees', 'service fee', 'cleaning fee', 'platform fee', 'how much', 'cost', 'pricing'],
    text: `RentiFi fees:
- The nightly rate is set by the host.
- A service fee is added during checkout to cover platform operations.
- Some listings include an optional cleaning fee set by the host.
- The total cost (including all fees) is shown clearly before you confirm a booking.
- Hosts receive payouts after RentiFi deducts its platform commission.`,
  },

  // ─── TECHNICAL / MISC ────────────────────────────────────────────────────
  {
    id: 'image-upload',
    tags: ['upload photo', 'image', 'photo limit', 'file size', 'profile picture upload', 'listing photos'],
    text: `Image upload guidelines:
- Maximum file size per image: 4 MB.
- Supported formats: JPEG, PNG, WebP.
- Property listings should have high-quality photos that accurately represent the space.
- Profile pictures should clearly show your face.
- Images are stored securely on Cloudinary.`,
  },
  {
    id: 'notifications',
    tags: ['notification', 'email notification', 'alerts', 'updates'],
    text: `RentiFi sends email notifications for:
- Booking confirmations and status changes
- New booking requests (hosts)
- Payment receipts
- Review reminders after a completed stay
- Account security events (email verification, password reset)
Manage your notification preferences in Settings.`,
  },
  {
    id: 'not-available',
    tags: ['not available', 'unavailable', 'blocked dates', 'calendar', 'availability'],
    text: `Property availability is managed by the host via the listing calendar.
If dates appear unavailable, they are either already booked or blocked by the host.
Try adjusting your dates or searching for similar properties nearby.`,
  },
];

/**
 * Retrieve the most relevant knowledge chunks for a given query.
 * Uses simple keyword/tag overlap scoring — no external vector DB needed.
 *
 * @param {string} query - The user's raw question.
 * @param {number} topK  - Maximum number of chunks to return.
 * @returns {string}     - Concatenated context text ready for the LLM prompt.
 */
export function retrieveContext(query, topK = 4) {
  const q = query.toLowerCase();

  const scored = knowledgeChunks.map((chunk) => {
    let score = 0;

    // Tag match — each matching tag contributes
    for (const tag of chunk.tags) {
      if (q.includes(tag)) score += 3;
    }

    // Word overlap between query and chunk text
    const chunkWords = new Set(chunk.text.toLowerCase().split(/\W+/));
    const queryWords = q.split(/\W+/);
    for (const word of queryWords) {
      if (word.length > 3 && chunkWords.has(word)) score += 1;
    }

    return { chunk, score };
  });

  const top = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  if (top.length === 0) {
    // Fallback: return overview + support chunk
    return [
      knowledgeChunks.find((c) => c.id === 'platform-overview'),
      knowledgeChunks.find((c) => c.id === 'contact-support'),
    ]
      .map((c) => c.text)
      .join('\n\n---\n\n');
  }

  return top.map((s) => s.chunk.text).join('\n\n---\n\n');
}
