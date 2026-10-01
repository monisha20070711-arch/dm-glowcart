const Address = require('../models/Address');

// @desc    Get user addresses
// @route   GET /api/addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new address
// @route   POST /api/addresses
const addAddress = async (req, res) => {
  try {
    const { fullName, phone, addressLine, city, state, pincode, landmark, isDefault } = req.body;

    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: 'Please provide all required address fields' });
    }

    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(pincode)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit Indian PIN code' });
    }

    // Check if user has any existing address
    const count = await Address.countDocuments({ user: req.user._id });
    const makeDefault = count === 0 ? true : isDefault;

    if (makeDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      landmark: landmark || '',
      isDefault: makeDefault
    });

    res.status(201).json({ success: true, data: address, message: 'Address saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    if (req.body.pincode) {
      const pinRegex = /^[1-9][0-9]{5}$/;
      if (!pinRegex.test(req.body.pincode)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit Indian PIN code' });
      }
    }

    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    Object.assign(address, req.body);
    const updated = await address.save();

    res.json({ success: true, data: updated, message: 'Address updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    await address.deleteOne();
    
    // If deleted address was default, set another address as default
    const remaining = await Address.find({ user: req.user._id });
    if (remaining.length > 0 && !remaining.some(a => a.isDefault)) {
      remaining[0].isDefault = true;
      await remaining[0].save();
    }

    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set address as default
// @route   PUT /api/addresses/:id/default
const setDefaultAddress = async (req, res) => {
  try {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isDefault: true },
      { new: true }
    );

    if (address) {
      res.json({ success: true, data: address, message: 'Default address updated' });
    } else {
      res.status(404).json({ success: false, message: 'Address not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};
