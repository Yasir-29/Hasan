const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// Public Routes

// Search items
router.get('/search', async (req, res) => {
    try {
        const {
            keyword,
            category,
            dateFrom,
            dateTo,
            location,
            color,
            status
        } = req.query;

        // Build search query
        const query = {};

        // Text search in name and description
        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Date range filter
        if (dateFrom || dateTo) {
            query.createdAt = {};
            if (dateFrom) {
                query.createdAt.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                query.createdAt.$lte = new Date(dateTo);
            }
        }

        // Location filter
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Color filter
        if (color) {
            query.color = { $regex: color, $options: 'i' };
        }

        // Status filter
        if (status && status !== 'all') {
            query.status = status;
        }

        const items = await Item.find(query)
            .sort({ createdAt: -1 });

        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Protected Routes (require authentication)

// Get user's items
router.get('/user/items', auth, async (req, res) => {
    try {
        const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Report a lost item
router.post('/lost', auth, async (req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            user: req.user.id,
            status: 'lost'
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Report a found item
router.post('/found', auth, async (req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            user: req.user.id,
            status: 'found'
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an item
router.put('/:id', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if user owns the item
        if (item.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this item' });
        }

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an item
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if user owns the item
        if (item.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this item' });
        }

        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 