const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');

// @POST /api/owner/property
const addProperty = async (req, res) => {
  try {
    const { title, description, address, city, state, rent, bedrooms, bathrooms, area, propertyType, amenities } = req.body;
    const images = req.files ? req.files.map((f) => f.filename) : [];
    const property = await Property.create({
      title, description, address, city, state,
      rent, bedrooms, bathrooms, area, propertyType,
      amenities: amenities ? amenities.split(',').map((a) => a.trim()) : [],
      images,
      owner: req.user._id,
    });
    res.status(201).json({ message: 'Property added successfully', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/owner/property/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const fields = ['title', 'description', 'address', 'city', 'state', 'rent', 'bedrooms', 'bathrooms', 'area', 'propertyType', 'isAvailable'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) property[field] = req.body[field];
    });
    if (req.body.amenities) property.amenities = req.body.amenities.split(',').map((a) => a.trim());
    if (req.files && req.files.length > 0) property.images = req.files.map((f) => f.filename);
    await property.save();
    res.json({ message: 'Property updated', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/owner/property/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await property.deleteOne();
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/owner/properties
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/owner/bookings
const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property', 'title address city rent')
      .populate('renter', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/owner/booking/:id
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    booking.status = status;
    await booking.save();
    if (status === 'approved') {
      await Property.findByIdAndUpdate(booking.property, { isAvailable: false });
    }
    res.json({ message: `Booking ${status}`, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addProperty, updateProperty, deleteProperty, getMyProperties, getOwnerBookings, updateBookingStatus };
