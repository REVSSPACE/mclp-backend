const express = require('express');
const router = express.Router();
const File = require('../models/File');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   GET /api/files
// @desc    Get all files for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { projectStatus, category, district } = req.query;
        
        let query = { createdBy: req.user._id };
        
        if (projectStatus) {
            query.projectStatus = projectStatus;
        }
        if (category) {
            query.category = category;
        }
        if (district) {
            query.district = district;
        }

        const files = await File.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: files.length,
            data: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/files/:id
// @desc    Get single file by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        res.status(200).json({
            success: true,
            data: file
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/files
// @desc    Create new file
// @access  Private
router.post('/', async (req, res) => {
    try {
        const fileData = {
            ...req.body,
            createdBy: req.user._id,
            projectStatus: 'new'
        };

        const file = await File.create(fileData);

        res.status(201).json({
            success: true,
            message: 'File created successfully',
            data: file
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/files/:id
// @desc    Update file
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        let file = await File.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        file = await File.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'File updated successfully',
            data: file
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/files/:id/status
// @desc    Update file project status
// @access  Private
router.put('/:id/status', async (req, res) => {
    try {
        const { projectStatus } = req.body;

        let file = await File.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        file.projectStatus = projectStatus;
        await file.save();

        res.status(200).json({
            success: true,
            message: 'Project status updated successfully',
            data: file
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/files/:id/handling-status
// @desc    Update handling project details (file status, remarks, documentation)
// @access  Private
router.put('/:id/handling-status', async (req, res) => {
    try {
        const { fileStatus, remarks, dwgStatus, formsStatus, onlineStatus } = req.body;

        let file = await File.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        if (fileStatus) file.fileStatus = fileStatus;
        if (remarks !== undefined) file.remarks = remarks;
        if (dwgStatus) file.dwgStatus = dwgStatus;
        if (formsStatus) file.formsStatus = formsStatus;
        if (onlineStatus) file.onlineStatus = onlineStatus;

        await file.save();

        res.status(200).json({
            success: true,
            message: 'Handling status updated successfully',
            data: file
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/files/:id
// @desc    Delete file
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const file = await File.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        await file.deleteOne();

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/files/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats/dashboard', async (req, res) => {
    try {
        const userId = req.user._id;

        const totalFiles = await File.countDocuments({ createdBy: userId });
        const newProjects = await File.countDocuments({ createdBy: userId, projectStatus: 'new' });
        const handlingProjects = await File.countDocuments({ createdBy: userId, projectStatus: 'handling' });
        const completedProjects = await File.countDocuments({ createdBy: userId, projectStatus: 'completed' });

        res.status(200).json({
            success: true,
            data: {
                totalFiles,
                newProjects,
                handlingProjects,
                completedProjects
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
