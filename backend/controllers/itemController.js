const Item = require('../models/Item');

// Create a new item
exports.createItem = async (req, res) => {
  const { name, category, description, dateLostOrFound, location, color, status } = req.body;
  try {
    const newItem = new Item({
      name,
      category,
      description,
      dateLostOrFound,
      location,
      color,
      status,
      user: req.user.id
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().populate('user', ['name', 'email']);
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get a single item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', ['name', 'email']);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  const { name, category, description, dateLostOrFound, location, color, status } = req.body;
  try {
    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Check user
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    item = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: { name, category, description, dateLostOrFound, location, color, status } },
      { new: true }
    );

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Check user
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await item.remove();
    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; 