const mongoose = require("mongoose")

const bookingschema = new mongoose.Schema({
    fullname:      { type: String, required: true },
    email:         { type: String },
    phone:         { type: Number },
    address:       { type: String },
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    productID:     { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    bookingDate:   { type: Date, default: Date.now },
    quantity:      { type: Number, default: 1 },
    totalamount:   { type: Number },
    bookingstatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Completed"],
        default: "Pending"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "unpaid", "failed"],
        default: "pending"
    },
    paymentInfo: { type: Object, default: {} }
})

module.exports = mongoose.model("Bookingtable", bookingschema)