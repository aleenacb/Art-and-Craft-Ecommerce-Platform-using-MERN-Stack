const jwt = require("jsonwebtoken")
const SECRET_KEY = "product-crud"

const usertable = require("../models/user_models")

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address, role } = req.body; // ← add role
        const useremail = await usertable.findOne({ email })
        if (useremail) {
            return res.json({ message: "email already exists" }) // ← add return
        }
        const userdetails = new usertable({
            name,
            email,
            password,
            phone,
            address,
            role: role || 'user'  // ← add this, defaults to 'user'
        })
        await userdetails.save()
        res.status(201).json({ message: "User registered successfully", udata: userdetails })
    } catch (error) {
        console.error("Error registering user:", error)
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already registered. Please login." });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


const getUsers = async (req,res)=>{
    try {
        const getAllUsers = await usertable.find()
        res.status(200).json({message: "Users fetched successfully", alluser: getAllUsers})
    } catch (error) {
        console.error("Error fetching users:", error)
        res.status(500).json({message: "Server error", error})
    }
}

const getUserById = async (req,res)=>{
    try {
        const uid = req.params.id
        const getUserById = await usertable.findById(uid)
        res.status(200).json({message: "User Fetched Successflly", byid: getUserById})
      } catch (error) {
        console.error("Error fetching users:", error)
        res.status(500).json({message: "Server error", error})
    }
} 

const deleteUser = async(req, res)=>{
    try{
        const duid = req.params.id
        const deleteUserById = await usertable.findByIdAndDelete(duid)
        console.log(deleteUserById)
        res.status(200).json({message:"User Deleted Successfully", dubyid : deleteUserById})
    }catch(error){
        console.error("Error fetching users:", error)
        res.status(500).json({message: "Server error", error})
    }
}

const updateUser = async(req, res)=>{
    try{
        const {id} = req.params
        const body = req.body

        const updatedUser = await usertable.findByIdAndUpdate(id, body, {new:true})

        res.status(201).json({message:"User Updated Successfully", userupdate : updatedUser})
    }catch(error){
        console.error("Error updating users:", error)
        res.status(500).json({message: "Server error", error})
    }
}

// For USERS only
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userlogin = await usertable.findOne({
            email: email,
            password: Number(password)
        });

        if (!userlogin) {
            return res.json({ success: false, message: "Invalid details" });
        }

        // block admins from user login
        if (userlogin.role === 'admin') {
            return res.json({ success: false, message: "Please use the admin login." });
        }

        const token = jwt.sign({ id: userlogin._id }, SECRET_KEY, { expiresIn: '1d' });
        return res.json({ success: true, message: "Login successful!", token, user: userlogin });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// For ADMIN only
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userlogin = await usertable.findOne({
            email: email,
            password: Number(password)
        });

        if (!userlogin) {
            return res.json({ success: false, message: "Invalid details" });
        }

        // block users from admin login
        if (userlogin.role !== 'admin') {
            return res.json({ success: false, message: "Access denied. Admins only." });
        }

        const token = jwt.sign({ id: userlogin._id }, SECRET_KEY, { expiresIn: '1d' });
        return res.json({ success: true, message: "Login successful!", token, user: userlogin });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await usertable.findById(req.userid)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" })
    }
}

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, password } = req.body;

    // ✅ Build update object only with provided fields
    const updateData = {};
    if (name)    updateData.name    = name;
    if (phone)   updateData.phone   = Number(phone);   // ✅ Schema expects Number
    if (address) updateData.address = address;
    if (password) updateData.password = Number(password); // ✅ Schema expects Number

    // ✅ Handle profile image upload
    if (req.files?.profileimage) {
      updateData.profileimage = req.files.profileimage[0].filename;
    }

    // ✅ Handle cover image upload
    if (req.files?.coverimage) {
      updateData.coverimage = req.files.coverimage[0].filename;
    }

    // ✅ req.userid comes from auth middleware
    const updatedUser = await usertable.findByIdAndUpdate(
      req.userid,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

module.exports = { registerUser, getUsers, getUserById, deleteUser, updateUser, Login, adminLogin, getProfile, updateProfile }