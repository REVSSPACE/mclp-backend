const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    }
}, { _id: false });

const fileSchema = new mongoose.Schema({
    // Basic File Information
    category: {
        type: String,
        required: true,
        enum: ['Regular', 'Unapproved', 'Land Use', 'Misc', 'Single Plot', 'RERA']
    },
    surveyNumber: {
        type: String,
        required: true,
        trim: true
    },
    
    // Location Details
    mapLink: {
        type: String,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    taluk: {
        type: String,
        required: true,
        trim: true
    },
    village: {
        type: String,
        required: true,
        trim: true
    },
    
    // Land Information
    extent: {
        type: Number,
        required: true,
        min: 0
    },
    extentUnit: {
        type: String,
        required: true,
        enum: ['Acres', 'Hectares', 'Sq.Ft', 'Sq.Yards', 'Cents']
    },
    
    // Ownership
    owners: [ownerSchema],
    
    // Contact Person
    contactName: {
        type: String,
        required: true
    },
    contactMobile: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    
    // Project Status
    projectStatus: {
        type: String,
        enum: ['new', 'handling', 'hold', 'completed'],
        default: 'new'
    },
    
    // File Status (for handling projects)
    fileStatus: {
        type: String,
        enum: ['', 'In Progress', 'DTCP In Progress', 'Client In Progress', 'Documentation', 'Approval Pending'],
        default: ''
    },
    
    // Documentation Status
    remarks: {
        type: String,
        default: ''
    },
    dwgStatus: {
        type: String,
        enum: ['', 'Not Started', 'In Progress', 'Completed', 'Under Review', 'Approved'],
        default: ''
    },
    formsStatus: {
        type: String,
        enum: ['', 'Not Started', 'In Progress', 'Partially Completed', 'Completed', 'Submitted', 'Approved'],
        default: ''
    },
    onlineStatus: {
        type: String,
        enum: ['', 'Not Started', 'Preparing Documents', 'Ready to Upload', 'Uploading', 'Uploaded', 'Under Verification', 'Verified'],
        default: ''
    },
    
    // Additional Notes
    notes: {
        type: String,
        default: ''
    },
    
    // User Reference
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
fileSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Indexes for better query performance
fileSchema.index({ surveyNumber: 1 });
fileSchema.index({ projectStatus: 1 });
fileSchema.index({ createdBy: 1 });
fileSchema.index({ district: 1, taluk: 1, village: 1 });

module.exports = mongoose.model('File', fileSchema);
