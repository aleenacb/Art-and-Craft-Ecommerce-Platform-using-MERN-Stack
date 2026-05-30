const jwt = require("jsonwebtoken")
const SECRET_KEY = "product-crud"

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")

        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }

        const actualToken = token.split(" ")[1]   // ✅ remove "Bearer"

        const decoded = jwt.verify(actualToken, SECRET_KEY)

        req.userid = decoded.id   // ✅ VERY IMPORTANT

    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Invalid token" })
    }
}

module.exports = auth
