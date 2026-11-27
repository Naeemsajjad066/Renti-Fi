// controllers/paymentController.js
import { stripe, calculatePaymentBreakdown, calculateRefundAmount } from '../config/stripe.js';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import {
  sendEmail,
  sendBookingConfirmationEmail,
  sendHostBookingNotification,
} from '../lib/emailService.js';
import {
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  PAYMENT_OPTION,
  VERIFICATION_STATUS,
  DEFAULT_CURRENCY,
  STRIPE_CURRENCY,
  PLATFORM_FEE_PERCENT,
  STRIPE_AMOUNT_MULTIPLIER,
  MS_PER_DAY,
  generateVerificationCode,
  BOOKING_POPULATE_FIELDS,
  STRIPE_PAYMENT_METHOD_TYPES,
  STRIPE_CHECKOUT_LOCALE,
} from '../constants/index.js';

// ─── Shared helpers ───────────────────────────────────────────────────────────

/** Populate a saved booking with the standard fields for client responses. */
function populateBooking(id) {
  return Booking.findById(id)
    .populate('property', BOOKING_POPULATE_FIELDS.property)
    .populate('guest', BOOKING_POPULATE_FIELDS.guest)
    .populate('host', BOOKING_POPULATE_FIELDS.host);
}

/** Reusable date validation used by multiple endpoints. */
function validateDates(checkIn, checkOut, requireFuture = false) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
    return { error: 'Invalid booking dates' };
  }
  if (checkOutDate <= checkInDate) {
    return { error: 'Check-out must be after check-in' };
  }
  if (requireFuture) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (checkInDate < today) {
      return { error: 'Check-in date cannot be in the past' };
    }
  }
  return { checkInDate, checkOutDate };
}

// ─── Create Stripe Checkout Session ──────────────────────────────────────────

export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingData } = req.body;

    if (!bookingData?.propertyId || !bookingData.checkIn || !bookingData.checkOut) {
      return res.status(400).json({ success: false, message: 'Missing required booking data' });
    }

    const property = await Property.findById(bookingData.propertyId).populate('host');
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    if (!property.isActive || property.verificationStatus !== VERIFICATION_STATUS.APPROVED) {
      return res.status(400).json({ success: false, message: 'This property is not available for booking' });
    }

    // Validate dates — require future check-in (same as createReservation)
    const dateResult = validateDates(bookingData.checkIn, bookingData.checkOut, true);
    if (dateResult.error) {
      return res.status(400).json({ success: false, message: dateResult.error });
    }
    const { checkInDate, checkOutDate } = dateResult;

    const nights = Math.ceil((checkOutDate - checkInDate) / MS_PER_DAY);

    // Always compute price from the property's current rate — never trust client input
    const totalPrice = property.price * nights;

    if (!property.paymentOptions) {
      return res.status(400).json({ success: false, message: 'Property does not have payment options configured' });
    }

    const validGuestOptions = [PAYMENT_OPTION.ARRIVAL, PAYMENT_OPTION.EARLY];
    if (!validGuestOptions.includes(bookingData.paymentOption)) {
      return res.status(400).json({ success: false, message: 'Invalid payment option' });
    }
    if (
      property.paymentOptions !== PAYMENT_OPTION.BOTH &&
      property.paymentOptions !== bookingData.paymentOption
    ) {
      return res.status(400).json({ success: false, message: 'Selected payment option is not available for this property' });
    }

    const breakdown = calculatePaymentBreakdown(totalPrice, bookingData.paymentOption);

    // Arrival payment — no Stripe checkout needed; caller should use createReservation
    if (bookingData.paymentOption === PAYMENT_OPTION.ARRIVAL) {
      return res.json({
        success: true,
        paymentOption: PAYMENT_OPTION.ARRIVAL,
        breakdown,
        message: 'No upfront payment required',
      });
    }

    const host = property.host;
    if (!host?.stripeAccountId) {
      return res.status(400).json({ success: false, message: 'Host has not connected their Stripe account' });
    }
    if (!host.stripeOnboardingComplete) {
      return res.status(400).json({ success: false, message: 'Host Stripe account setup is incomplete' });
    }

    // Build metadata — stored on both session and payment_intent so the webhook
    // can reconstruct the booking regardless of which object it receives
    const sharedMetadata = {
      propertyId: bookingData.propertyId,
      guestId: req.user._id.toString(),
      hostId: host._id.toString(),
      paymentOption: bookingData.paymentOption,
      totalPrice: String(totalPrice),          // server-computed, not client-supplied
      upfrontAmount: String(breakdown.upfrontAmount),
      arrivalAmount: String(breakdown.arrivalAmount),
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      nights: String(nights),
      guestsAdults: String(bookingData.guests?.adults || 1),
      guestsChildren: String(bookingData.guests?.children || 0),
      guestsInfants: String(bookingData.guests?.infants || 0),
      guestsPets: String(bookingData.guests?.pets || 0),
      hostStripeAccountId: host.stripeAccountId,
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: STRIPE_PAYMENT_METHOD_TYPES,
      line_items: [
        {
          price_data: {
            currency: STRIPE_CURRENCY,
            product_data: {
              name: property.title,
              description: `${nights} night${nights !== 1 ? 's' : ''}`,
              images: property.images?.length ? [property.images[0]] : [],
            },
            unit_amount: Math.round(breakdown.upfrontAmount * STRIPE_AMOUNT_MULTIPLIER),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      locale: STRIPE_CHECKOUT_LOCALE,
      success_url: `${process.env.FRONTEND_URL}/bookings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/property/${property._id}`,
      customer_email: req.user.email,
      payment_intent_data: { metadata: sharedMetadata },
      metadata: sharedMetadata,
    });

    res.json({ success: true, sessionId: session.id, url: session.url, breakdown });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create checkout session' });
  }
};

// ─── Confirm Payment and Create Booking ──────────────────────────────────────
// Called by the client after Stripe redirects back. Acts as a fallback —
// the webhook (handleCheckoutCompleted) is the primary booking creator.

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ success: false, message: 'paymentIntentId is required' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ success: false, message: 'Payment has not been completed' });
    }

    const metadata = paymentIntent.metadata;

    if (metadata.guestId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Payment does not belong to the authenticated user' });
    }

    // If the webhook already created the booking, return it populated
    const existingBooking = await populateBooking(
      (await Booking.findOne({ stripePaymentIntentId: paymentIntentId }))?._id
    );
    if (existingBooking) {
      return res.json({ success: true, message: 'Payment already confirmed', booking: existingBooking });
    }

    const property = await Property.findById(metadata.propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    if (!property.isActive || property.verificationStatus !== VERIFICATION_STATUS.APPROVED) {
      return res.status(400).json({ success: false, message: 'This property is no longer available for booking' });
    }

    const dateResult = validateDates(metadata.checkIn, metadata.checkOut);
    if (dateResult.error) {
      return res.status(400).json({ success: false, message: dateResult.error });
    }
    const { checkInDate, checkOutDate } = dateResult;

    const overlapping = await Booking.findOverlappingBookings(metadata.propertyId, checkInDate, checkOutDate);
    if (overlapping.length > 0) {
      // Dates are now taken — auto-refund the guest
      try {
        await stripe.refunds.create({
          payment_intent: paymentIntentId,
          reason: 'duplicate',
        });
      } catch (refundErr) {
        console.error('Auto-refund failed after overlap detected:', refundErr.message);
      }
      return res.status(409).json({
        success: false,
        message: 'These dates have just been booked by someone else. Your payment has been refunded.',
      });
    }

    // Use server-computed price — never trust metadata.totalPrice
    const nights = Math.ceil((checkOutDate - checkInDate) / MS_PER_DAY);
    const totalPrice = property.price * nights;
    const breakdown = calculatePaymentBreakdown(totalPrice, metadata.paymentOption);

    const booking = await Booking.create({
      property: metadata.propertyId,
      guest: req.user._id,
      host: property.host,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: {
        adults: parseInt(metadata.guestsAdults, 10) || 1,
        children: parseInt(metadata.guestsChildren, 10) || 0,
        infants: parseInt(metadata.guestsInfants, 10) || 0,
        pets: parseInt(metadata.guestsPets, 10) || 0,
      },
      basePrice: totalPrice,
      cleaningFee: 0,
      serviceFee: 0,
      taxes: 0,
      totalPrice,
      currency: DEFAULT_CURRENCY,
      paymentOption: metadata.paymentOption,
      paymentBreakdown: {
        upfrontAmount: breakdown.upfrontAmount,
        upfrontPaid: true,
        upfrontPaidAt: new Date(),
        upfrontPaymentIntentId: paymentIntentId,
        arrivalAmount: breakdown.arrivalAmount,
        arrivalPaid: false,
      },
      stripePaymentIntentId: paymentIntentId,
      stripeChargeId: paymentIntent.latest_charge ?? paymentIntent.charges?.data[0]?.id,
      paymentStatus: PAYMENT_STATUS.PARTIAL,
      paymentMethod: PAYMENT_METHOD.CREDIT_CARD,
      paidAt: new Date(),
      status: BOOKING_STATUS.CONFIRMED,
      specialRequests: '',
      verificationCode: generateVerificationCode(),
    });

    const populatedBooking = await populateBooking(booking._id);

    try {
      await sendBookingConfirmationEmail(populatedBooking, populatedBooking.property, populatedBooking.guest);
      await sendHostBookingNotification(populatedBooking, populatedBooking.property, populatedBooking.guest, populatedBooking.host);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({ success: true, message: 'Payment confirmed and booking created', booking: populatedBooking });
  } catch (error) {
    // Duplicate key = webhook beat us to it; return the existing populated booking
    if (error.code === 11000) {
      try {
        const existing = await populateBooking(
          (await Booking.findOne({ stripePaymentIntentId: req.body.paymentIntentId }))?._id
        );
        if (existing) {
          return res.json({ success: true, message: 'Payment already confirmed', booking: existing });
        }
      } catch { /* fall through to generic error */ }
    }
    console.error('Error confirming payment:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to confirm payment' });
  }
};

// ─── Create Reservation (Arrival Payment — No Upfront Stripe Charge) ─────────

export const createReservation = async (req, res) => {
  try {
    const { bookingData } = req.body;

    if (!bookingData?.propertyId || !bookingData.checkIn || !bookingData.checkOut || !bookingData.guests) {
      return res.status(400).json({ success: false, message: 'All booking fields are required' });
    }

    const property = await Property.findById(bookingData.propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    if (!property.isActive || property.verificationStatus !== VERIFICATION_STATUS.APPROVED) {
      return res.status(400).json({ success: false, message: 'This property is not available for booking' });
    }
    if (property.host.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot book your own property' });
    }
    if (property.paymentOptions === PAYMENT_OPTION.EARLY) {
      return res.status(400).json({ success: false, message: 'This property requires upfront payment' });
    }

    const dateResult = validateDates(bookingData.checkIn, bookingData.checkOut, true);
    if (dateResult.error) {
      return res.status(400).json({ success: false, message: dateResult.error });
    }
    const { checkInDate, checkOutDate } = dateResult;

    const nights = Math.ceil((checkOutDate - checkInDate) / MS_PER_DAY);

    const guests =
      typeof bookingData.guests === 'object'
        ? bookingData.guests
        : { adults: Number(bookingData.guests), children: 0, infants: 0, pets: 0 };

    const guestsObj = {
      adults: Number(guests.adults ?? 0),
      children: Number(guests.children ?? 0),
      infants: Number(guests.infants ?? 0),
      pets: Number(guests.pets ?? 0),
    };

    if (Object.values(guestsObj).some((c) => !Number.isFinite(c) || c < 0) || guestsObj.adults < 1) {
      return res.status(400).json({ success: false, message: 'Invalid guests value' });
    }
    if (guestsObj.adults + guestsObj.children + guestsObj.infants > property.maxGuests) {
      return res.status(400).json({ success: false, message: `Property can accommodate a maximum of ${property.maxGuests} guests` });
    }

    const overlapping = await Booking.findOverlappingBookings(bookingData.propertyId, checkInDate, checkOutDate);
    if (overlapping.length > 0) {
      return res.status(409).json({ success: false, message: 'Property is not available for the selected dates' });
    }

    const totalPrice = property.price * nights;
    const breakdown = calculatePaymentBreakdown(totalPrice, PAYMENT_OPTION.ARRIVAL);

    const booking = await Booking.create({
      property: bookingData.propertyId,
      guest: req.user._id,
      host: property.host,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: guestsObj,
      basePrice: totalPrice,
      cleaningFee: 0,
      serviceFee: 0,
      taxes: 0,
      totalPrice,
      currency: DEFAULT_CURRENCY,
      paymentOption: PAYMENT_OPTION.ARRIVAL,
      paymentBreakdown: {
        upfrontAmount: 0,
        upfrontPaid: false,
        arrivalAmount: breakdown.arrivalAmount,
        arrivalPaid: false,
      },
      paymentStatus: PAYMENT_STATUS.PENDING,
      paymentMethod: PAYMENT_METHOD.CASH,
      status: BOOKING_STATUS.CONFIRMED,
      specialRequests: bookingData.specialRequests || '',
      verificationCode: generateVerificationCode(),
    });

    const populatedBooking = await populateBooking(booking._id);

    try {
      await sendBookingConfirmationEmail(populatedBooking, populatedBooking.property, populatedBooking.guest);
      await sendHostBookingNotification(populatedBooking, populatedBooking.property, populatedBooking.guest, populatedBooking.host);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({ success: true, message: 'Reservation created successfully', booking: populatedBooking });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create reservation' });
  }
};

// ─── Process Refund on Cancellation ──────────────────────────────────────────

export const processRefund = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('property', 'cancellationPolicy title')
      .populate('guest', 'fullName email phoneNumber');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.guest._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }
    if (!booking.canCancel()) {
      return res.status(400).json({ success: false, message: 'This booking can no longer be cancelled' });
    }

    const refundAmount = calculateRefundAmount(booking, booking.property.cancellationPolicy);

    let refund = null;
    if (refundAmount > 0 && booking.stripeChargeId) {
      refund = await stripe.refunds.create({
        charge: booking.stripeChargeId,
        amount: Math.round(refundAmount * STRIPE_AMOUNT_MULTIPLIER),
        reason: 'requested_by_customer',
        metadata: {
          bookingId,
          cancellationReason: cancellationReason || 'Guest requested cancellation',
        },
      });
    }

    booking.status = BOOKING_STATUS.CANCELLED;
    booking.cancelledBy = 'guest';
    booking.cancelledAt = new Date();
    booking.cancellationReason = cancellationReason || 'Cancelled by guest';
    booking.refundAmount = refundAmount;
    booking.stripeRefundId = refund?.id ?? null;
    booking.refundedAt = refund ? new Date() : null;
    if (refundAmount > 0) booking.paymentStatus = PAYMENT_STATUS.REFUNDED;

    await booking.save();

    try {
      await sendCancellationEmail(booking, refundAmount);
    } catch (emailError) {
      console.error('Cancellation email failed:', emailError);
    }

    res.json({ success: true, message: 'Booking cancelled successfully', refundAmount, booking });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to process refund' });
  }
};

// ─── Record Arrival Payment ───────────────────────────────────────────────────

export const recordArrivalPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    const allowedStatuses = [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.RESERVED];
    if (!allowedStatuses.includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot record arrival payment for a booking with status: ${booking.status}`,
      });
    }

    booking.paymentBreakdown.arrivalPaid = true;
    booking.paymentBreakdown.arrivalPaidAt = new Date();
    booking.paymentStatus = PAYMENT_STATUS.PAID;
    booking.status = BOOKING_STATUS.CHECKED_IN;

    await booking.save();

    res.json({ success: true, message: 'Arrival payment recorded successfully', booking });
  } catch (error) {
    console.error('Error recording arrival payment:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to record payment' });
  }
};

// ─── Stripe Webhook Handler ───────────────────────────────────────────────────

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Respond to Stripe immediately — processing happens asynchronously
  res.json({ received: true });

  // Handle events after responding so Stripe doesn't time out waiting
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handleFailedPayment(event.data.object);
        break;
      case 'payment_intent.succeeded':
      case 'charge.refunded':
      case 'payout.paid':
        console.log(`Stripe event received: ${event.type}`);
        break;
      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }
  } catch (handlerError) {
    // Log but don't re-throw — Stripe already received 200
    console.error(`Error handling Stripe event ${event.type}:`, handlerError);
  }
};

// ─── Internal: Webhook event handlers ────────────────────────────────────────

async function handleCheckoutCompleted(session) {
  const bookingData = session.metadata ?? {};

  if (!bookingData.propertyId || !bookingData.guestId) {
    console.error('Webhook: missing required metadata on session', session.id);
    return;
  }

  // Dedup: skip if already created by confirmPayment (client redirect)
  const existingBooking = await Booking.findOne({
    $or: [
      { stripeCheckoutSessionId: session.id },
      { stripePaymentIntentId: session.payment_intent },
    ],
  });
  if (existingBooking) {
    console.log('Webhook: booking already exists, skipping creation');
    return;
  }

  const property = await Property.findById(bookingData.propertyId);
  if (!property) {
    console.error('Webhook: property not found for session', session.id);
    return;
  }

  const checkInDate = new Date(bookingData.checkIn);
  const checkOutDate = new Date(bookingData.checkOut);

  // Guard against double-booking — auto-refund if dates are taken
  const overlapping = await Booking.findOverlappingBookings(bookingData.propertyId, checkInDate, checkOutDate);
  if (overlapping.length > 0) {
    console.error(`Webhook: dates already booked for property ${bookingData.propertyId} — issuing refund`);
    try {
      await stripe.refunds.create({ payment_intent: session.payment_intent, reason: 'duplicate' });
    } catch (refundErr) {
      console.error('Auto-refund failed:', refundErr.message);
    }
    return;
  }

  // Always recompute price from server — never trust metadata amounts
  const nights = Math.ceil((checkOutDate - checkInDate) / MS_PER_DAY);
  const totalPrice = property.price * nights;
  const breakdown = calculatePaymentBreakdown(totalPrice, bookingData.paymentOption);

  const booking = await Booking.create({
    property: bookingData.propertyId,
    guest: bookingData.guestId,
    host: bookingData.hostId,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    nights,
    guests: {
      adults: parseInt(bookingData.guestsAdults, 10) || 1,
      children: parseInt(bookingData.guestsChildren, 10) || 0,
      infants: parseInt(bookingData.guestsInfants, 10) || 0,
      pets: parseInt(bookingData.guestsPets, 10) || 0,
    },
    basePrice: totalPrice,
    totalPrice,
    currency: DEFAULT_CURRENCY,
    paymentOption: bookingData.paymentOption,
    paymentBreakdown: {
      upfrontAmount: breakdown.upfrontAmount,
      upfrontPaid: true,
      upfrontPaidAt: new Date(),
      upfrontPaymentIntentId: session.payment_intent,
      arrivalAmount: breakdown.arrivalAmount,
      arrivalPaid: false,
    },
    stripePaymentIntentId: session.payment_intent,
    stripeCheckoutSessionId: session.id,
    paymentStatus: PAYMENT_STATUS.PARTIAL,
    paymentMethod: PAYMENT_METHOD.CREDIT_CARD,
    paidAt: new Date(),
    status: BOOKING_STATUS.CONFIRMED,
    verificationCode: generateVerificationCode(),
  }).catch((createError) => {
    // 11000 = unique index violation — confirmPayment already created it
    if (createError.code === 11000) {
      console.log('Webhook: duplicate key — booking created by confirmPayment, skipping');
      return null;
    }
    throw createError;
  });

  if (!booking) return;

  // Transfer to host via Stripe Connect (5% platform fee deducted)
  if (bookingData.hostStripeAccountId) {
    try {
      const totalAmountCents = Math.round(breakdown.upfrontAmount * STRIPE_AMOUNT_MULTIPLIER);
      const platformFeeCents = Math.round(totalAmountCents * PLATFORM_FEE_PERCENT);
      const hostAmountCents = totalAmountCents - platformFeeCents;

      const transfer = await stripe.transfers.create({
        amount: hostAmountCents,
        currency: STRIPE_CURRENCY,
        destination: bookingData.hostStripeAccountId,
        transfer_group: `booking_${booking._id}`,
        metadata: {
          bookingId: booking._id.toString(),
          propertyId: bookingData.propertyId,
          platformFee: platformFeeCents,
        },
      });

      booking.stripeTransferId = transfer.id;
      booking.platformFee = platformFeeCents / STRIPE_AMOUNT_MULTIPLIER;
      booking.hostPayout = hostAmountCents / STRIPE_AMOUNT_MULTIPLIER;
      await booking.save();
    } catch (transferError) {
      console.error('Host transfer failed — requires manual retry:', transferError.message);
    }
  }

  // Send confirmation emails
  try {
    const populatedBooking = await populateBooking(booking._id);
    await sendBookingConfirmationEmail(populatedBooking, populatedBooking.property, populatedBooking.guest);
    await sendHostBookingNotification(populatedBooking, populatedBooking.property, populatedBooking.guest, populatedBooking.host);
  } catch (emailError) {
    console.error('Confirmation emails failed:', emailError);
  }
}

async function handleFailedPayment(paymentIntent) {
  try {
    const booking = await Booking.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (booking) {
      booking.paymentStatus = PAYMENT_STATUS.FAILED;
      booking.status = BOOKING_STATUS.CANCELLED;
      booking.cancelledBy = 'system';
      booking.cancelledAt = new Date();
      booking.cancellationReason = 'Payment failed';
      await booking.save();
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

// ─── Internal: Email helpers ──────────────────────────────────────────────────

async function sendCancellationEmail(booking, refundAmount) {
  if (!booking.guest?.email) return;

  await sendEmail({
    to: booking.guest.email,
    subject: 'Booking Cancellation Confirmation',
    html: `
      <h2>Booking Cancelled</h2>
      <p>Hi ${booking.guest.fullName || 'there'},</p>
      <p>Your booking (ID: <strong>${booking._id}</strong>) has been cancelled.</p>
      ${
        refundAmount > 0
          ? `<p>A refund of <strong>Rs ${refundAmount.toLocaleString()}</strong> will be processed to your original payment method within 5–10 business days.</p>`
          : `<p>As per the cancellation policy, no refund is applicable for this cancellation.</p>`
      }
      <p>If you have any questions, contact us at rentifi.project@gmail.com</p>
    `,
  });
}

export default {
  createCheckoutSession,
  confirmPayment,
  createReservation,
  processRefund,
  recordArrivalPayment,
  handleStripeWebhook,
};
