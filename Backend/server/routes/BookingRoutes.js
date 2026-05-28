const express = require('express')
const route = express.Router()
const { Createbooking, getAllBookings, updateBookingStatus, updatePaymentStatus, getUserBookings } = require('../controller/BookingController')

route.post("/create", Createbooking)
route.get("/getAll", getAllBookings)
route.get("/user/:userId", getUserBookings)   
route.put("/updateStatus/:id", updateBookingStatus)
route.put("/updatePaymentStatus/:id", updatePaymentStatus)

<<<<<<< HEAD
module.exports = route
=======
module.exports = route
>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
