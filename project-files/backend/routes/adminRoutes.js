const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const {
  getAllUsers, deleteUser, getAllProperties,
  deleteProperty, getAllBookings, getStats,
} = require('../controllers/adminController');

router.use(protect, authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.delete('/user/:id', deleteUser);
router.get('/properties', getAllProperties);
router.delete('/property/:id', deleteProperty);
router.get('/bookings', getAllBookings);
router.get('/stats', getStats);

module.exports = router;
