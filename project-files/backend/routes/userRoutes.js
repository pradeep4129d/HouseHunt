const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middlewares/authMiddleware');

const {
  register, login, forgotPassword, getProfile,
  updateProfile, getAllProperties, bookProperty,
  getMyBookings, cancelBooking,
} = require('../controllers/userController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profilePic'), updateProfile);
router.get('/properties', getAllProperties);
router.post('/book/:propertyId', protect, bookProperty);
router.get('/my-bookings', protect, getMyBookings);
router.put('/cancel-booking/:bookingId', protect, cancelBooking);

module.exports = router;
