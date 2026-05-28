<<<<<<< HEAD
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
=======
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
>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
