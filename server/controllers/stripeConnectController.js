// controllers/stripeConnectController.js
import { stripe } from '../config/stripe.js';
import User from '../models/User.js';

// Create Stripe Connect account for host
export const createConnectAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user already has a Stripe account
    if (user.stripeAccountId) {
      return res.status(400).json({
        success: false,
        message: 'Stripe account already exists',
      });
    }

    // Create Stripe Express account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US', // Changed to US for testing (Stripe doesn't support PK in test mode)
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: {
        userId: userId.toString(),
        email: user.email,
        fullName: user.fullName,
      },
    });

    // Save Stripe account ID to user
    user.stripeAccountId = account.id;
    user.stripeAccountStatus = 'pending';
    user.isHost = true;
    await user.save();

    res.json({
      success: true,
      accountId: account.id,
      message: 'Stripe Connect account created',
    });
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create Stripe account',
    });
  }
};

// Create account onboarding link
export const createAccountLink = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || !user.stripeAccountId) {
      return res.status(400).json({
        success: false,
        message: 'No Stripe account found. Please create one first.',
      });
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: `${process.env.FRONTEND_URL}/host/stripe/refresh`,
      return_url: `${process.env.FRONTEND_URL}/host/stripe/return`,
      type: 'account_onboarding',
    });

    res.json({
      success: true,
      url: accountLink.url,
    });
  } catch (error) {
    console.error('Error creating account link:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create onboarding link',
    });
  }
};

// Check account status
export const getAccountStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || !user.stripeAccountId) {
      return res.json({
        success: true,
        connected: false,
        onboardingComplete: false,
      });
    }

    // Retrieve account from Stripe
    const account = await stripe.accounts.retrieve(user.stripeAccountId);

    // Check if onboarding is complete
    const onboardingComplete = account.charges_enabled && account.payouts_enabled;

    // Update user status
    if (onboardingComplete !== user.stripeOnboardingComplete) {
      user.stripeOnboardingComplete = onboardingComplete;
      user.stripeAccountStatus = onboardingComplete ? 'active' : 'pending';
      await user.save();
    }

    res.json({
      success: true,
      connected: true,
      onboardingComplete,
      accountStatus: account.charges_enabled ? 'active' : 'pending',
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    });
  } catch (error) {
    console.error('Error checking account status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check account status',
    });
  }
};

// Create dashboard link for host to manage their Stripe account
export const createDashboardLink = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || !user.stripeAccountId) {
      return res.status(400).json({
        success: false,
        message: 'No Stripe account found',
      });
    }

    // Create login link to Stripe dashboard
    const loginLink = await stripe.accounts.createLoginLink(user.stripeAccountId);

    res.json({
      success: true,
      url: loginLink.url,
    });
  } catch (error) {
    console.error('Error creating dashboard link:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create dashboard link',
    });
  }
};

export default {
  createConnectAccount,
  createAccountLink,
  getAccountStatus,
  createDashboardLink,
};
