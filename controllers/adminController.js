const jwt = require('jsonwebtoken');

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Hardcoded Admin Credentials for simplicity (as per plan)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@coderise.io';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';

    // console.log(`Attempting login: ${email} / ${password}`);
    // console.log(`Expected: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      res.json({
        _id: 'admin_1',
        email: ADMIN_EMAIL,
        token: generateToken('admin_1'),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

module.exports = { loginAdmin };
