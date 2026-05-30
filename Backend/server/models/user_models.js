
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:         { type: String, required: true },
    email:        { type: String, required: true, unique: true },
    password:     { type: Number, required: true },
    role:         { type: String, default: 'user'},
    phone:        { type: Number, required: true },
    address:      { type: String, required: true },
    profileimage: { type: String },
    coverimage:   { type: String },
    
});

module.exports = mongoose.model('user', userSchema);
