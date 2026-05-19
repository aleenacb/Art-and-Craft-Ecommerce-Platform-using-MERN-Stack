const Bookingtable = require('../models/BookingModel')

const Createbooking = async (req, res) => {
    try {
        const { fullname, email, phone, address, quantity, userId, productID, totalamount } = req.body;
        const newbooking = new Bookingtable({ fullname, email, phone, address, quantity, userId, productID, totalamount });
        const savebooking = await newbooking.save();
        res.status(201).json({ message: "Booking created successfully", bdata: savebooking });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Bookingtable.find()
            .populate('userId', 'name email')
            .populate('productID', 'pname price')
            .sort({ bookingDate: -1 });
        res.status(200).json({ message: "Bookings fetched", bdata: bookings });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { bookingstatus } = req.body;
        const validStatuses = ["Pending", "Approved", "Rejected", "Completed"];
        if (!validStatuses.includes(bookingstatus))
            return res.status(400).json({ message: "Invalid status value" });
        const updated = await Bookingtable.findByIdAndUpdate(id, { bookingstatus }, { new: true });
        if (!updated) return res.status(404).json({ message: "Booking not found" });
        res.status(200).json({ message: "Status updated", bdata: updated });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { paymentStatus } = req.body
    const booking = await Bookingtable.findByIdAndUpdate(  
      id,
      { paymentStatus },
      { new: true }
    )
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.status(200).json({ message: 'Payment status updated', booking })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Bookingtable.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { Createbooking, getAllBookings, updateBookingStatus, updatePaymentStatus, getUserBookings }
