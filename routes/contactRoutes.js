const express = require('express');
const router = express.Router();
const { submitContact, getContacts } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(submitContact)
    .get(protect, getContacts);

module.exports = router;
