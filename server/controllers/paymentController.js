// controllers/paymentController.js
import { stripe, calculatePaymentBreakdown, calculateRefundAmount } from '../config/stripe.js';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import { sendEmail } from '../lib/emailService.js';

// Create Stripe Checkout Session for payment
export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingData } = req.body;

    // Validate booking data
    if (!bookingData || !bookingData.propertyId || !bookingData.totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking data'
      });
    }

    // Fetch property to get payment options
    const property = await Property.findById(bookingData.propertyId).populate('host');
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if property has payment options configured
    if (!property.paymentOptions) {
      return res.status(400).json({
        success: false,
        message: 'Property does not have payment options configured'
      });
    }

    // Calculate payment breakdown
    const breakdown = calculatePaymentBreakdown(
      bookingData.totalPrice,
      bookingData.paymentOption
    );

    // For 'arrival' payment, no checkout needed
    if (bookingData.paymentOption === 'arrival') {
      return res.json({
        success: true,
        paymentOption: 'arrival',
        breakdown,
        message: 'No upfront payment required'
      });
    }

    // Get host's Stripe account (property.host is already populated)
    const host = property.host;
    if (!host || !host.stripeAccountId) {
      return res.status(400).json({
        success: false,
        message: 'Host has not connected their Stripe account'
      });
    }

    if (!host.stripeOnboardingComplete) {
      return res.status(400).json({
        success: false,
        message: 'Host Stripe account setup is incomplete'
      });
    }

    // Store host's Stripe account ID in metadata for later transfer
    const platformFeePercent = 0.05; // 5% platform commission

    // Create Checkout Session - payment goes to RentiFi account
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'pkr', // Pakistani Rupees
            product_data: {
              name: property.title,
              description: `${bookingData.nights} nights`,
              images: property.images ? [property.images[0]] : [],
            },
            unit_amount: Math.round(breakdown.upfrontAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      locale: 'en', // Set explicit locale to avoid module errors
      success_url: `${process.env.FRONTEND_URL}/bookings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/property/${property._id}`,
      payment_intent_data: {
        metadata: {
          propertyId: bookingData.propertyId,
          guestId: req.user._id.toString(),
          hostId: property.host._id.toString(),
          paymentOption: bookingData.paymentOption,
          totalPrice: bookingData.totalPrice,
          upfrontAmount: breakdown.upfrontAmount,
          arrivalAmount: breakdown.arrivalAmount,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guestsAdults: bookingData.guests?.adults || bookingData.guests || 1,
          guestsChildren: bookingData.guests?.children || 0,
          guestsInfants: bookingData.guests?.infants || 0,
          nights: bookingData.nights,
          hostStripeAccountId: host.stripeAccountId, // For transfer after payment
        },
      },
      customer_email: req.user.email,
      metadata: {
        propertyId: bookingData.propertyId,
        guestId: req.user._id.toString(),
        hostId: property.host._id.toString(),
        paymentOption: bookingData.paymentOption,
        totalPrice: bookingData.totalPrice,
        upfrontAmount: breakdown.upfrontAmount,
        arrivalAmount: breakdown.arrivalAmount,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guestsAdults: bookingData.guests?.adults || bookingData.guests || 1,
        guestsChildren: bookingData.guests?.children || 0,
        guestsInfants: bookingData.guests?.infants || 0,
        nights: bookingData.nights,
        hostStripeAccountId: host.stripeAccountId, // For transfer after payment
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      breakdown
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create checkout session'
    });
  }
};

// Confirm Payment and Create Booking
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, bookingData } = req.body;

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Extract metadata
    const metadata = paymentIntent.metadata;
    
    // Fetch property
    const property = await Property.findById(metadata.propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Calculate payment breakdown
    const breakdown = calculatePaymentBreakdown(
      parseInt(metadata.totalPrice),
      metadata.paymentOption
    );

    // Create booking with payment information
    const booking = await Booking.create({
      property: metadata.propertyId,
      guest: req.user._id,
      host: property.host,
      checkIn: new Date(bookingData.checkIn),
      checkOut: new Date(bookingData.checkOut),
      nights: bookingData.nights,
      guests: bookingData.guests,
      basePrice: bookingData.basePrice,
      cleaningFee: bookingData.cleaningFee || 0,
      serviceFee: bookingData.serviceFee || 0,
      taxes: bookingData.taxes || 0,
      totalPrice: bookingData.totalPrice,
      currency: 'PKR',
      paymentOption: metadata.paymentOption,
      paymentBreakdown: {
        upfrontAmount: breakdown.upfrontAmount,
        upfrontPaid: true,
        upfrontPaidAt: new Date(),
        upfrontPaymentIntentId: paymentIntentId,
        arrivalAmount: breakdown.arrivalAmount,
        arrivalPaid: false
      },
      stripePaymentIntentId: paymentIntentId,
      stripeChargeId: paymentIntent.charges.data[0]?.id,
      paymentStatus: 'partial',
      paymentMethod: 'credit_card',
      paidAt: new Date(),
      status: 'confirmed',
      specialRequests: bookingData.specialRequests || ''
    });

    // Populate booking details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title images city address')
      .populate('guest', 'fullName email')
      .populate('host', 'fullName email');

    // Send confirmation emails
    try {
      await sendPaymentConfirmationEmail(populatedBooking, property, breakdown);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking creation if email fails
    }

    res.json({
      success: true,
      message: 'Payment confirmed and booking created',
      booking: populatedBooking
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to confirm payment'
    });
  }
};

// Create Reservation (No Upfront Payment)
export const createReservation = async (req, res) => {
  try {
    const { bookingData } = req.body;

    // Fetch property
    const property = await Property.findById(bookingData.propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if arrival payment is allowed
    if (property.paymentOptions === 'early') {
      return res.status(400).json({
        success: false,
        message: 'This property requires upfront payment'
      });
    }

    // Calculate payment breakdown
    const breakdown = calculatePaymentBreakdown(
      bookingData.totalPrice,
      'arrival'
    );

    // Create booking without payment
    const booking = await Booking.create({
      property: bookingData.propertyId,
      guest: req.user._id,
      host: property.host,
      checkIn: new Date(bookingData.checkIn),
      checkOut: new Date(bookingData.checkOut),
      nights: bookingData.nights,
      guests: bookingData.guests,
      basePrice: bookingData.basePrice,
      cleaningFee: bookingData.cleaningFee || 0,
      serviceFee: bookingData.serviceFee || 0,
      taxes: bookingData.taxes || 0,
      totalPrice: bookingData.totalPrice,
      currency: 'PKR',
      paymentOption: 'arrival',
      paymentBreakdown: {
        upfrontAmount: 0,
        upfrontPaid: false,
        arrivalAmount: breakdown.arrivalAmount,
        arrivalPaid: false
      },
      paymentStatus: 'pending',
      paymentMethod: 'cash',
      status: 'reserved',
      specialRequests: bookingData.specialRequests || ''
    });

    // Populate booking details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title images city address')
      .populate('guest', 'fullName email')
      .populate('host', 'fullName email');

    // Send reservation confirmation emails
    try {
      await sendReservationConfirmationEmail(populatedBooking, property);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Reservation created successfully',
      booking: populatedBooking
    });

  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create reservation'
    });
  }
};

// Process Refund on Cancellation
export const processRefund = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancellationReason } = req.body;

    // Fetch booking
    const booking = await Booking.findById(bookingId)
      .populate('property', 'cancellationPolicy title');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user is the guest
    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled'
      });
    }

    // Calculate refund amount
    const refundAmount = calculateRefundAmount(
      booking,
      booking.property.cancellationPolicy
    );

    let refund = null;
    
    // Process refund if applicable
    if (refundAmount > 0 && booking.stripeChargeId) {
      refund = await stripe.refunds.create({
        charge: booking.stripeChargeId,
        amount: Math.round(refundAmount * 100), // Convert to cents
        reason: 'requested_by_customer',
        metadata: {
          bookingId: bookingId,
          cancellationReason: cancellationReason || 'Guest requested cancellation'
        }
      });
    }

    // Update booking
    booking.status = 'cancelled';
    booking.cancelledBy = 'guest';
    booking.cancelledAt = new Date();
    booking.cancellationReason = cancellationReason || 'Cancelled by guest';
    booking.refundAmount = refundAmount;
    booking.stripeRefundId = refund?.id;
    booking.refundedAt = refund ? new Date() : null;
    
    if (refundAmount > 0) {
      booking.paymentStatus = 'refunded';
    }

    await booking.save();

    // Send cancellation emails
    try {
      await sendCancellationEmail(booking, refundAmount);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      refundAmount,
      booking
    });

  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process refund'
    });
  }
};

// Record Arrival Payment (Paid in cash on arrival)
export const recordArrivalPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Fetch booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user is the host
    if (booking.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Mark arrival payment as paid
    booking.paymentBreakdown.arrivalPaid = true;
    booking.paymentBreakdown.arrivalPaidAt = new Date();
    booking.paymentStatus = 'paid';
    booking.status = 'checked-in';

    await booking.save();

    res.json({
      success: true,
      message: 'Arrival payment recorded successfully',
      booking
    });

  } catch (error) {
    console.error('Error recording arrival payment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to record payment'
    });
  }
};

// Stripe Webhook Handler
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

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed:', session.id);
      await handleCheckoutCompleted(session);
      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      break;

    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log('PaymentIntent failed:', failedPaymentIntent.id);
      await handleFailedPayment(failedPaymentIntent);
      break;

    case 'charge.refunded':
      const refund = event.data.object;
      console.log('Charge refunded:', refund.id);
      break;

    case 'payout.paid':
      const payout = event.data.object;
      console.log('Payout completed:', payout.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Handle checkout session completed
async function handleCheckoutCompleted(session) {
  try {
    const metadata = session.metadata;
    const paymentIntentMetadata = session.payment_intent_metadata || {};
    
    // Merge metadata from session and payment intent
    const bookingData = {
      ...metadata,
      ...paymentIntentMetadata
    };

    // Fetch property
    const property = await Property.findById(bookingData.propertyId);
    if (!property) {
      console.error('Property not found for checkout session');
      return;
    }

    // Calculate payment breakdown
    const breakdown = calculatePaymentBreakdown(
      parseFloat(bookingData.totalPrice),
      bookingData.paymentOption
    );

    // Create booking
    const booking = await Booking.create({
      property: bookingData.propertyId,
      guest: bookingData.guestId,
      host: bookingData.hostId,
      checkIn: new Date(bookingData.checkIn),
      checkOut: new Date(bookingData.checkOut),
      nights: parseInt(bookingData.nights),
      guests: {
        adults: parseInt(bookingData.guestsAdults) || 1,
        children: parseInt(bookingData.guestsChildren) || 0,
        infants: parseInt(bookingData.guestsInfants) || 0
      },
      basePrice: parseFloat(bookingData.totalPrice),
      totalPrice: parseFloat(bookingData.totalPrice),
      currency: 'PKR',
      paymentOption: bookingData.paymentOption,
      paymentBreakdown: {
        upfrontAmount: breakdown.upfrontAmount,
        upfrontPaid: true,
        upfrontPaidAt: new Date(),
        upfrontPaymentIntentId: session.payment_intent,
        arrivalAmount: breakdown.arrivalAmount,
        arrivalPaid: false
      },
      stripePaymentIntentId: session.payment_intent,
      stripeCheckoutSessionId: session.id,
      paymentStatus: 'partial',
      paymentMethod: 'credit_card',
      paidAt: new Date(),
      status: 'confirmed'
    });

    console.log('Booking created from webhook:', booking._id);

    // Transfer funds to host's bank account (via Stripe Connect)
    try {
      const hostStripeAccountId = bookingData.hostStripeAccountId;
      if (hostStripeAccountId) {
        const platformFeePercent = 0.05; // 5% platform commission
        const totalAmount = Math.round(breakdown.upfrontAmount * 100); // in cents
        const platformFee = Math.round(totalAmount * platformFeePercent);
        const hostAmount = totalAmount - platformFee;

        // Create transfer to host's connected account
        const transfer = await stripe.transfers.create({
          amount: hostAmount,
          currency: 'pkr',
          destination: hostStripeAccountId,
          transfer_group: `booking_${booking._id}`,
          metadata: {
            bookingId: booking._id.toString(),
            propertyId: bookingData.propertyId,
            platformFee: platformFee,
          },
        });

        // Update booking with transfer info
        booking.stripeTransferId = transfer.id;
        booking.platformFee = platformFee / 100;
        booking.hostPayout = hostAmount / 100;
        await booking.save();

        console.log(`Transfer created: ${transfer.id} - Rs ${hostAmount/100} to host (Platform fee: Rs ${platformFee/100})`);
      }
    } catch (transferError) {
      console.error('Error transferring to host:', transferError);
      // Don't fail the booking if transfer fails - can retry manually
    }

    // Send confirmation email
    try {
      await sendPaymentConfirmationEmail(booking, property, breakdown);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

// Helper function to handle failed payments
async function handleFailedPayment(paymentIntent) {
  try {
    // Find booking with this payment intent
    const booking = await Booking.findOne({
      stripePaymentIntentId: paymentIntent.id
    });

    if (booking) {
      booking.paymentStatus = 'failed';
      booking.status = 'cancelled';
      await booking.save();
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

// Email helper functions
async function sendPaymentConfirmationEmail(booking, property, breakdown) {
  const emailData = {
    to: booking.guest.email,
    subject: 'Payment Confirmed - Booking Receipt',
    html: `
      <h2>Payment Confirmation</h2>
      <p>Hi ${booking.guest.fullName},</p>
      <p>Your payment has been confirmed for <strong>${property.title}</strong>.</p>
      <h3>Payment Details:</h3>
      <ul>
        <li>Amount Paid Now: Rs ${breakdown.upfrontAmount.toLocaleString()}</li>
        <li>Due on Arrival: Rs ${breakdown.arrivalAmount.toLocaleString()}</li>
        <li>Total Amount: Rs ${booking.totalPrice.toLocaleString()}</li>
      </ul>
      <h3>Booking Details:</h3>
      <ul>
        <li>Check-in: ${new Date(booking.checkIn).toLocaleDateString()}</li>
        <li>Check-out: ${new Date(booking.checkOut).toLocaleDateString()}</li>
        <li>Nights: ${booking.nights}</li>
      </ul>
      <p>Your booking ID is: ${booking._id}</p>
      <p>Please remember to pay the remaining Rs ${breakdown.arrivalAmount.toLocaleString()} on arrival.</p>
    `
  };
  
  await sendEmail(emailData);
}

async function sendReservationConfirmationEmail(booking, property) {
  const emailData = {
    to: booking.guest.email,
    subject: 'Reservation Confirmed',
    html: `
      <h2>Reservation Confirmation</h2>
      <p>Hi ${booking.guest.fullName},</p>
      <p>Your reservation for <strong>${property.title}</strong> has been confirmed.</p>
      <h3>Booking Details:</h3>
      <ul>
        <li>Check-in: ${new Date(booking.checkIn).toLocaleDateString()}</li>
        <li>Check-out: ${new Date(booking.checkOut).toLocaleDateString()}</li>
        <li>Nights: ${booking.nights}</li>
        <li>Total Amount: Rs ${booking.totalPrice.toLocaleString()}</li>
      </ul>
      <p>Your booking ID is: ${booking._id}</p>
      <p><strong>Payment: Full payment of Rs ${booking.totalPrice.toLocaleString()} is due on arrival.</strong></p>
    `
  };
  
  await sendEmail(emailData);
}

async function sendCancellationEmail(booking, refundAmount) {
  const emailData = {
    to: booking.guest.email,
    subject: 'Booking Cancellation Confirmation',
    html: `
      <h2>Booking Cancelled</h2>
      <p>Hi,</p>
      <p>Your booking (ID: ${booking._id}) has been cancelled.</p>
      ${refundAmount > 0 ? `
        <p>A refund of Rs ${refundAmount.toLocaleString()} will be processed to your original payment method within 5-10 business days.</p>
      ` : `
        <p>As per the cancellation policy, no refund is applicable for this cancellation.</p>
      `}
    `
  };
  
  await sendEmail(emailData);
}

export default {
  createCheckoutSession,
  confirmPayment,
  createReservation,
  processRefund,
  recordArrivalPayment,
  handleStripeWebhook
};
