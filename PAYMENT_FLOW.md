# RentiFi Payment Flow

## Overview
RentiFi uses **Stripe Connect** to enable secure payments with automatic transfers to host bank accounts.

## How It Works

### 1. Host Onboarding
- Host clicks "Link Bank Account" in their dashboard
- Backend creates a Stripe Express account for the host
- Host is redirected to Stripe to:
  - Complete KYC verification
  - Add bank account details
- Once completed, host can list properties

### 2. Guest Booking & Payment
1. **Guest books property**
   - Selects dates and completes booking form
   - Clicks "Book Now" with early payment option

2. **Payment Collection**
   - Backend creates Stripe Checkout Session
   - Guest is redirected to Stripe's secure payment page
   - **Payment goes to RentiFi's Stripe account**

3. **Automatic Transfer**
   - After successful payment, webhook fires (`checkout.session.completed`)
   - Booking is created in database
   - **Automatic transfer created:**
     - Platform keeps 5% commission
     - 95% transferred to host's connected Stripe account
   - Host receives funds in their bank account per Stripe's payout schedule

### 3. Platform Commission
- **5% platform fee** automatically deducted from each booking
- Platform revenue stays in RentiFi's Stripe account
- Host receives 95% of booking amount

### 4. Webhook Handling
Backend handles these Stripe events:
- `checkout.session.completed` → Create booking + Transfer funds to host
- `payment_intent.succeeded` → Confirm payment success
- `payout.paid` → Notify host of bank transfer

## Technical Details

### Database Models

**User (Host)**
```javascript
{
  stripeAccountId: String,          // Stripe Connect account ID
  stripeAccountStatus: String,      // pending/active/restricted
  stripeOnboardingComplete: Boolean // KYC completed
}
```

**Booking**
```javascript
{
  stripePaymentIntentId: String,    // Payment Intent ID
  stripeCheckoutSessionId: String,  // Checkout Session ID
  stripeTransferId: String,         // Transfer ID to host
  platformFee: Number,              // 5% commission
  hostPayout: Number,               // 95% to host
  paymentStatus: String             // confirmed/failed
}
```

### API Endpoints

**Stripe Connect**
- `POST /api/stripe-connect/create-account` - Create Express account
- `POST /api/stripe-connect/create-link` - Get onboarding URL
- `GET /api/stripe-connect/status` - Check account status
- `GET /api/stripe-connect/dashboard-link` - Access Stripe dashboard

**Payments**
- `POST /api/payments/create-checkout` - Create Checkout Session
- `POST /api/payments/webhook` - Handle Stripe webhooks

### Money Flow

```
Guest Payment ($100)
    ↓
RentiFi Stripe Account ($100)
    ↓
Automatic Transfer
    ├─→ Platform Fee: $5 (stays in RentiFi account)
    └─→ Host Transfer: $95 (goes to host's bank)
```

### Payout Schedule
- Stripe automatically transfers funds to host's bank account
- Default: Rolling 2-day basis (can be configured)
- Hosts can view payout history in Stripe Dashboard

## Testing

### Test Mode Setup
1. Enable Stripe Connect in Dashboard: https://dashboard.stripe.com/settings/connect
2. Use test card: `4242 4242 4242 4242`
3. Use Stripe CLI for webhooks:
   ```bash
   stripe listen --forward-to localhost:5000/api/payments/webhook
   ```
4. Test routing number: `110000000`
5. Test account number: `000123456789`

### Test Flow
1. Host links bank account → Enter test banking details
2. Guest books property → Use test card
3. Check webhook logs → Verify transfer created
4. View Stripe Dashboard → Confirm transfer to connected account

## Configuration

### Environment Variables
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
```

### Currency & Country
- **Test Mode**: USD, United States only
- **Production**: Configure based on your region

## Advantages of This Flow

✅ **Platform Control**: Money flows through RentiFi first  
✅ **Automatic Payouts**: No manual transfers needed  
✅ **Compliance**: Stripe handles banking regulations  
✅ **Security**: PCI compliant payment processing  
✅ **Transparency**: Hosts see all transactions in Stripe Dashboard  
✅ **Refunds**: Easy to handle through Stripe's refund API  

## Future Enhancements
- [ ] Multiple currencies support
- [ ] Custom payout schedules for hosts
- [ ] Instant payouts (additional fee)
- [ ] Detailed transaction analytics in admin panel
- [ ] Automated tax reporting
