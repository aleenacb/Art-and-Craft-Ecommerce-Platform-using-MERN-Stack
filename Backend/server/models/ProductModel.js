<<<<<<< HEAD
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    productimage:{type:String}
    
}, {
    timestamps: true  
});

=======
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    productimage:{type:String}
    
}, {
    timestamps: true  
});

>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
module.exports = mongoose.model('product', productSchema);