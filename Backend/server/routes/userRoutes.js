<<<<<<< HEAD
const express = require('express');  // ← add this line at the top
const { registerUser, getUsers, getUserById, deleteUser, updateUser, Login, adminLogin, getProfile, updateProfile } = require('../controller/user_controller');
const auth = require("../middleware/Auth");
const multer = require("multer");
const route = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

route.post('/registerUser', registerUser);
route.post('/Login', Login);
route.post('/AdminLogin', adminLogin);
route.get('/getUsers', getUsers);
route.get('/getUserById/:id', getUserById);
route.delete('/deleteuserbyid/:id', deleteUser);
route.put('/updateUser/:id', updateUser);
route.get('/getProfile', auth, getProfile);
route.put('/updateProfile', auth, upload.fields([
  { name: "profileimage", maxCount: 1 },
  { name: "coverimage",   maxCount: 1 }
]), updateProfile);

=======
const express = require('express');  // ← add this line at the top
const { registerUser, getUsers, getUserById, deleteUser, updateUser, Login, adminLogin, getProfile, updateProfile } = require('../controller/user_controller');
const auth = require("../middleware/Auth");
const multer = require("multer");
const route = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

route.post('/registerUser', registerUser);
route.post('/Login', Login);
route.post('/AdminLogin', adminLogin);
route.get('/getUsers', getUsers);
route.get('/getUserById/:id', getUserById);
route.delete('/deleteuserbyid/:id', deleteUser);
route.put('/updateUser/:id', updateUser);
route.get('/getProfile', auth, getProfile);
route.put('/updateProfile', auth, upload.fields([
  { name: "profileimage", maxCount: 1 },
  { name: "coverimage",   maxCount: 1 }
]), updateProfile);

>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
module.exports = route;