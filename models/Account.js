const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Revenue', 'Expenses', 'Assets', 'Liabilities', 'Capital', 'Investments', 'Operational', 'Administrative']
    },
    type: {
        type: String,
        required: true,
        enum: ['Cash', 'Bank Transfer', 'Cheque', 'Online Payment', 'Credit Card', 'Other']
    },
    credit: {
        type: Number,
        default: 0,
        min: 0
    },
    debit: {
        type: Number,
        default: 0,
        min: 0
    },
    description: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Validation: Either credit or debit must be greater than 0, but not both
accountSchema.pre('save', function(next) {
    if ((this.credit > 0 && this.debit > 0) || (this.credit === 0 && this.debit === 0)) {
        return next(new Error('Either credit or debit must be greater than 0, but not both'));
    }
    next();
});

// Index for better query performance
accountSchema.index({ date: -1 });
accountSchema.index({ createdBy: 1 });
accountSchema.index({ category: 1 });

module.exports = mongoose.model('Account', accountSchema);
