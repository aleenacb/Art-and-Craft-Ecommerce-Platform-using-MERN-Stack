require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');                          // ✅ moved to top
const dbconnection = require('./config/db');
const usertable = require('./models/user_models');

const app = express();

app.use(cors());
app.use(express.json());

dbconnection();

app.get('/apitest', (req, res) => {
  res.send('API is working fine');
});

app.use('/user',     require('./routes/userRoutes'));
app.use('/product',  require('./routes/productRoutes'));
app.use('/category', require('./routes/categoryRoutes'));
app.use('/booking',  require('./routes/BookingRoutes'));
app.use('/cart',     require('./routes/cart_routes'));
app.use('/order',    require('./routes/order_route'));
app.use('/review',   require('./routes/reviewRoutes'));  // ✅ already added
app.use('/uploads',  express.static(path.join(__dirname, 'uploads')));  // ✅ kept one clean version

app.get('/debug/users', async (req, res) => {
  const users = await usertable.find({}, { email: 1, password: 1 });
  res.json(users);
});

app.listen(7000, () => {
  console.log("Server running on port 7000");
});
