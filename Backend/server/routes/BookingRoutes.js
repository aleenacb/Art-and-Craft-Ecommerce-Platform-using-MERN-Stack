const express = require('express')
const route = express.Router()
const { Createbooking, getAllBookings, updateBookingStatus, updatePaymentStatus, getUserBookings } = require('../controller/BookingController')

route.post("/create", Createbooking)
route.get("/getAll", getAllBookings)
route.get("/user/:userId", getUserBookings)   
route.put("/updateStatus/:id", updateBookingStatus)
route.put("/updatePaymentStatus/:id", updatePaymentStatus)

module.exports = route