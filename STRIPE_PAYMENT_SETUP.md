# Stripe Payment System Setup Guide

This document provides complete instructions for setting up the Stripe payment integration for Rentifi.

## Features

The payment system supports two payment options:

1. **Pay on Arrival (Reserve Only)**
   - Guests reserve the property without paying online
   - Full payment due in cash upon arrival
   - No credit card required for booking

2. **Early Payment (40% Upfront + 60% on Arrival)**
   - Guests pay 40% online via Stripe to secure booking
   - Remaining 60% due in cash upon arrival
   - More secure for hosts

## Cancellation Policies

Three cancellation policies are available:

- **Flexible**: Full refund 1+ days before check-in, 50% refund < 1 day
- **Moderate**: Full refund 7+ days, 50% refund 3-6 days, no refund < 3 days
- **Strict**: Full refund 14+ days, 50% refund 7-13 days, no refund < 7 days

---

## Prerequisites

- Node.js installed (v16+ recommended)
- MongoDB running
- Stripe account (create at https://stripe.com)

---

## Setup Instructions

### 1. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create an account or log in
3. Switch to **Test Mode** (toggle in top-right)
4. Navigate to **Developers** → **API keys**
5. Copy the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 2. Configure Webhook

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL:
   - For local development: `http://localhost:5000/api/payments/webhook`
   - For production: `https://yourdomain.com/api/payments/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

### 3. Configure Environment Variables

#### Server (.env file in /server)

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Other variables...
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

#### Client (.env file in /client)

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Stripe Publishable Key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

### 4. Install Dependencies

```bash
# Server dependencies (already installed)
cd server
npm install

# Client dependencies (already installed)
cd ../client
npm install
```

### 5. Start the Application

```bash
# Terminal 1: Start server
cd server
npm start

# Terminal 2: Start client
cd client
npm run dev
```

---

## Testing the Payment System

### Test Cards

Stripe provides test cards for different scenarios:

| Card Number         | Scenario                |
|---------------------|-------------------------|
| 4242 4242 4242 4242 | Successful payment      |
| 4000 0000 0000 9995 | Declined payment        |
| 4000 0025 0000 3155 | Requires authentication |

- Use any future expiry date (e.g., 12/25)
- Use any 3-digit CVC (e.g., 123)
- Use any ZIP code (e.g., 12345)

### Testing Workflow

#### As a Host:

1. Go to **Add Listing**
2. Fill in property details
3. In **Pricing & Payment** step:
   - Set a price (e.g., 5000 PKR/night)
   - Select payment option (arrival/early/both)
   - Select cancellation policy
4. Publish listing
5. Wait for admin approval

#### As a Guest (Early Payment):

1. Browse properties
2. Select a property with "early" payment option
3. Click **Book Now**
4. Choose dates and guests
5. Select **Pay Now (40% Advance)**
6. Fill in card details using test card: `4242 4242 4242 4242`
7. Submit payment
8. Check booking confirmation

#### As a Guest (Arrival Payment):

1. Browse properties
2. Select a property with "arrival" payment option
3. Click **Book Now**
4. Choose dates and guests
5. Select **Pay on Arrival**
6. Confirm reservation (no payment required)
7. Check reservation confirmation

#### Testing Refunds:

1. Go to **My Bookings**
2. Click **Cancel** on a booking
3. Confirm cancellation
4. Check refund amount based on cancellation policy
5. View refund in Stripe Dashboard → **Payments** → **Refunds**

---

## Webhook Testing Locally

For local development, use Stripe CLI to forward webhook events:

1. Install Stripe CLI:
   ```bash
   # Windows (using Scoop)
   scoop install stripe
   
   # macOS
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:5000/api/payments/webhook
   ```

4. Copy the webhook signing secret displayed and update `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

---

## API Endpoints

### Payment Endpoints

| Method | Endpoint                          | Description                    | Protected |
|--------|-----------------------------------|--------------------------------|-----------|
| POST   | /api/payments/create-intent       | Create payment intent          | Yes       |
| POST   | /api/payments/confirm             | Confirm payment & create booking | Yes     |
| POST   | /api/payments/reserve             | Create reservation (no payment) | Yes      |
| POST   | /api/payments/refund/:bookingId   | Process refund on cancellation | Yes       |
| POST   | /api/payments/arrival/:bookingId  | Record arrival payment (host)  | Yes       |
| POST   | /api/payments/webhook             | Stripe webhook handler         | No        |

---

## Database Schema

### Property Model Updates

```javascript
{
  paymentOptions: {
    type: String,
    enum: ['arrival', 'early', 'both'],
    required: [true, 'Payment options are required']
  },
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict'],
    required: [true, 'Cancellation policy is required']
  },
  stripeAccountId: String // For future Stripe Connect integration
}
```

### Booking Model Updates

```javascript
{
  paymentOption: {
    type: String,
    enum: ['arrival', 'early'],
    required: true
  },
  paymentBreakdown: {
    upfrontAmount: Number,
    upfrontPaid: Boolean,
    upfrontPaidAt: Date,
    upfrontPaymentIntentId: String,
    arrivalAmount: Number,
    arrivalPaid: Boolean,
    arrivalPaidAt: Date,
    arrivalPaymentIntentId: String
  },
  stripePaymentIntentId: String,
  stripeChargeId: String,
  stripeRefundId: String,
  refundAmount: Number,
  refundedAt: Date,
  status: ['reserved', 'confirmed', 'checked-in', 'completed', 'cancelled'],
  paymentStatus: ['pending', 'partial', 'paid', 'refunded', 'failed']
}
```

---

## Security Best Practices

✅ **Implemented:**

- Payment intent creation on backend (never trust client)
- Stripe webhook signature verification
- User authentication for all payment endpoints
- PCI compliance using Stripe Elements (card details never touch server)
- Raw body parsing for webhook endpoint
- HTTPS required in production

---

## Email Notifications

Automated emails are sent for:

- ✅ Payment confirmation (early payment)
- ✅ Reservation confirmation (arrival payment)
- ✅ Cancellation confirmation with refund details
- ✅ Host notification for new bookings

---

## Troubleshooting

### Issue: Stripe not loading

**Solution:** Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set in client `.env`

### Issue: Webhook signature verification fails

**Solution:** Ensure `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint in Stripe Dashboard

### Issue: Payment intent creation fails

**Solution:** Verify `STRIPE_SECRET_KEY` is correct and starts with `sk_test_`

### Issue: Payment option not showing

**Solution:** Ensure property has `paymentOptions` and `cancellationPolicy` configured

### Issue: Can't publish listing

**Solution:** Payment options and cancellation policy are required fields - configure them in Step 6

---

## Production Deployment

### Pre-Deployment Checklist:

1. [ ] Switch to **Live Mode** in Stripe Dashboard
2. [ ] Update environment variables with live Stripe keys:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...`
3. [ ] Configure production webhook endpoint
4. [ ] Update `STRIPE_WEBHOOK_SECRET` with production webhook secret
5. [ ] Enable HTTPS on your domain
6. [ ] Test end-to-end payment flow in production
7. [ ] Monitor Stripe Dashboard for live transactions

### Additional Considerations:

- Set up proper error monitoring (e.g., Sentry)
- Configure email service for production (SendGrid, AWS SES)
- Enable Stripe Radar for fraud protection
- Set up bank account for payouts in Stripe Dashboard

---

## Support

For Stripe-related questions:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For application issues:
- Check server logs for errors
- Verify environment variables are set correctly
- Test with Stripe test cards first

---

## Future Enhancements

Potential features to implement:

- [ ] Stripe Connect for direct payouts to hosts
- [ ] Multi-currency support
- [ ] Split payments (platform fee)
- [ ] Payment plans for long-term bookings
- [ ] Apple Pay / Google Pay integration
- [ ] Receipt generation and download
- [ ] Analytics dashboard for payment metrics

---

**Last Updated:** $(Get-Date -Format "yyyy-MM-dd")
**Version:** 1.0
