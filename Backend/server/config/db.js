const mongoose = require('mongoose');

const CONNECTION_URI = 'mongodb://localhost:27017/InternshipProject'; 

const dbconnection = async () => {
    try {
        await mongoose.connect(CONNECTION_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);    
    }
}

<<<<<<< HEAD
module.exports = dbconnection;
=======
module.exports = dbconnection;
>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
