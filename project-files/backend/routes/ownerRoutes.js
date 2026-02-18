const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const {
  addProperty, updateProperty, deleteProperty,
  getMyProperties, getOwnerBookings, updateBookingStatus,
} = require('../controllers/ownerController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.use(protect, authorizeRoles('owner'));

router.post('/property', upload.array('images', 10), addProperty);
router.put('/property/:id', upload.array('images', 10), updateProperty);
router.delete('/property/:id', deleteProperty);
router.get('/properties', getMyProperties);
router.get('/bookings', getOwnerBookings);
router.put('/booking/:id', updateBookingStatus);

module.exports = router;
