const jwt = require("jsonwebtoken")
const SECRET_KEY = "product-crud"

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")

        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }

<<<<<<< HEAD
        const actualToken = token.split(" ")[1]   // ✅ remove "Bearer"

        const decoded = jwt.verify(actualToken, SECRET_KEY)

        req.userid = decoded.id   // ✅ VERY IMPORTANT
=======
        const actualToken = token.split(" ")[1]   

        const decoded = jwt.verify(actualToken, SECRET_KEY)

        req.userid = decoded.id   
>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3

        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Invalid token" })
    }
}

<<<<<<< HEAD
module.exports = auth
=======
module.exports = auth
>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
