# Booking Email Notification System

## Overview
Automated email notification system that sends booking confirmations with verification codes to both guests and hosts when a booking is created.

## Features Implemented

### 1. Guest Booking Confirmation Email
- **Subject**: "Booking Confirmed - {Property Title}"
- **Recipient**: Guest email
- **Content**:
  - Confirmation checkmark icon
  - Large verification code display (6-digit code in blue box)
  - Complete booking details (property, dates, guests, nights, total amount)
  - Check-in/check-out times (9:00 AM)
  - Instruction to show code to host at check-in
  - Link to view booking details
  - RentiFi branding and styling

### 2. Host Booking Notification Email
- **Subject**: "New Booking Received - {Property Title}"
- **Recipient**: Host email
- **Content**:
  - House emoji icon
  - Large verification code display (6-digit code in green box)
  - Guest information (name, email, phone number)
  - Complete booking details (property, dates, guests, nights, total amount, host payout)
  - Special requests (if any)
  - Instruction to ask guest for code at check-in
  - Link to view booking details
  - RentiFi branding and styling

## Email Templates

### Updated Templates in `server/config/email.js`:
1. **bookingConfirmation** - Enhanced guest confirmation with verification code
2. **hostBookingNotification** - New host notification template

### Email Service Functions in `server/lib/emailService.js`:
1. **sendBookingConfirmationEmail(booking, property, user)** - Sends to guest
2. **sendHostBookingNotification(booking, property, guest, host)** - Sends to host

## Email Triggers

Emails are sent automatically after booking creation in three scenarios:

### 1. Stripe Checkout Webhook (handleCheckoutCompleted)
**Location**: `server/controllers/paymentController.js` (line ~600)
- Triggered when Stripe checkout session completes
- After booking is created and saved
- Populates booking with guest, host, and property data
- Sends both emails with error handling

### 2. Direct Payment Confirmation (confirmPaymentAndBook)
**Location**: `server/controllers/paymentController.js` (line ~220)
- Triggered when payment intent is confirmed
- After booking is created with payment details
- Sends both emails to guest and host

### 3. Arrival Payment Booking (createReservation)
**Location**: `server/controllers/paymentController.js` (line ~310)
- Triggered when creating pay-at-arrival bookings
- After booking is created with reserved status
- Sends both emails even though payment is pending

## Configuration

### Environment Variables (.env)
```env
# Email Service
EMAIL_SERVICE=gmail
EMAIL_FROM=Rentifi <rentifi.project@gmail.com>
EMAIL_USER=rentifi.project@gmail.com
EMAIL_APP_PASSWORD=xjmwffloiahxamaf

# Client URL for email links
CLIENT_URL=http://localhost:8080
```

### Email Links in Templates
- Guest: `{CLIENT_URL}/bookings` - View all bookings
- Host: `{CLIENT_URL}/host/bookings` - View host bookings

## Email Styling

### Color Scheme
- **Primary Brand**: #A0937D (tan/beige)
- **Guest Code Box**: #2196f3 (blue) with #e3f2fd background
- **Host Code Box**: #4caf50 (green) with #e8f5e9 background
- **Success Green**: #28a745
- **Warning Yellow**: #ffc107 background with #856404 text

### Responsive Design
- Maximum width: 600px
- White card with shadow on light gray background
- Centered content
- Mobile-friendly table layouts

## Error Handling
- Email errors are caught and logged
- Booking creation continues even if emails fail
- Console logs for debugging:
  - "Booking confirmation email sent to guest"
  - "Booking notification email sent to host"
  - Error logs if sending fails

## Verification Code Flow
1. 6-digit code generated during booking creation
2. Stored in `booking.verificationCode` field
3. Displayed prominently in both emails:
   - **Guest**: Blue box with "Show this code to your host at check-in"
   - **Host**: Green box with "Ask guest to show this code at check-in"
4. Used for check-in verification process

## Testing Checklist
- [ ] Test email sending after Stripe checkout completion
- [ ] Test email sending for direct payment bookings
- [ ] Test email sending for pay-at-arrival bookings
- [ ] Verify guest receives email with correct verification code
- [ ] Verify host receives email with same verification code
- [ ] Check all booking details display correctly
- [ ] Test email links redirect to correct pages
- [ ] Verify email styling on different email clients
- [ ] Test error handling when email service fails

## Database Requirements
- Booking must be populated with:
  - `guest`: fullName, email, phoneNumber
  - `host`: fullName, email, phoneNumber
  - `property`: title, city, address

## Important Notes
1. **Gmail App Password**: Must be configured in EMAIL_APP_PASSWORD
2. **Verification Code**: Required field in Booking model (unique, 6 digits)
3. **Error Isolation**: Email failures don't prevent booking creation
4. **Both Emails**: Always sent together (guest + host) after booking
5. **Check-in Times**: 9:00 AM for check-in, 9:00 AM for check-out
6. **Host Payout**: Displayed in host email if available (after Stripe transfer)

## Future Enhancements
- [ ] Email preview functionality
- [ ] Resend email option
- [ ] Email templates in multiple languages
- [ ] SMS notifications in addition to email
- [ ] Booking update/cancellation emails
- [ ] Payment reminder emails for arrival payments
- [ ] Check-in/check-out reminder emails
