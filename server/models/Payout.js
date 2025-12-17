import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  payoutMethod: {
    type: String,
    enum: ['bank_transfer', 'manual'],
    default: 'bank_transfer'
  },
  bankDetails: {
    accountHolderName: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String
  },
  transactionId: {
    type: String,
    default: ''
  },
  processedAt: {
    type: Date
  },
  failureReason: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
payoutSchema.index({ host: 1, status: 1 });
payoutSchema.index({ booking: 1 });

const Payout = mongoose.model('Payout', payoutSchema);

export default Payout;
