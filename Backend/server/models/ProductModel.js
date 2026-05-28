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

module.exports = mongoose.model('product', productSchema);