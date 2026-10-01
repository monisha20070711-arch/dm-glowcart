const Contact = require('../models/Contact');

// @desc    Submit contact form message
// @route   POST /api/contact
const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all contact form fields' });
    }

    const contact = await Contact.create({
      name,
      email: email.toLowerCase(),
      subject,
      message
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Thank you for reaching out! Our DM-GLOWCART support team will contact you shortly.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contact submissions (Admin)
// @route   GET /api/contact
const getContactSubmissions = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitContactForm,
  getContactSubmissions
};
