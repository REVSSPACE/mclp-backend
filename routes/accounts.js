const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   GET /api/accounts
// @desc    Get all accounts for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { category, startDate, endDate } = req.query;
        
        let query = { createdBy: req.user._id };
        
        if (category) {
            query.category = category;
        }
        
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const accounts = await Account.find(query).sort({ date: -1 });

        // Calculate totals
        let totalCredit = 0;
        let totalDebit = 0;
        
        accounts.forEach(account => {
            totalCredit += account.credit;
            totalDebit += account.debit;
        });

        const balance = totalCredit - totalDebit;

        res.status(200).json({
            success: true,
            count: accounts.length,
            summary: {
                totalCredit,
                totalDebit,
                balance
            },
            data: accounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/accounts/:id
// @desc    Get single account by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const account = await Account.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account entry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: account
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/accounts
// @desc    Create new account entry
// @access  Private
router.post('/', async (req, res) => {
    try {
        const accountData = {
            ...req.body,
            createdBy: req.user._id
        };

        const account = await Account.create(accountData);

        res.status(201).json({
            success: true,
            message: 'Account entry created successfully',
            data: account
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/accounts/:id
// @desc    Update account entry
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        let account = await Account.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account entry not found'
            });
        }

        account = await Account.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'Account entry updated successfully',
            data: account
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/accounts/:id
// @desc    Delete account entry
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const account = await Account.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account entry not found'
            });
        }

        await account.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Account entry deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/accounts/stats/summary
// @desc    Get account summary statistics
// @access  Private
router.get('/stats/summary', async (req, res) => {
    try {
        const accounts = await Account.find({ createdBy: req.user._id });

        let totalCredit = 0;
        let totalDebit = 0;
        
        accounts.forEach(account => {
            totalCredit += account.credit;
            totalDebit += account.debit;
        });

        const balance = totalCredit - totalDebit;

        // Category-wise breakdown
        const categoryBreakdown = {};
        accounts.forEach(account => {
            if (!categoryBreakdown[account.category]) {
                categoryBreakdown[account.category] = {
                    credit: 0,
                    debit: 0
                };
            }
            categoryBreakdown[account.category].credit += account.credit;
            categoryBreakdown[account.category].debit += account.debit;
        });

        res.status(200).json({
            success: true,
            data: {
                totalCredit,
                totalDebit,
                balance,
                categoryBreakdown
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
