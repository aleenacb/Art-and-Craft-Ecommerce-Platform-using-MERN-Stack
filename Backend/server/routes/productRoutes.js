<<<<<<< HEAD
const express = require('express');
const { addProduct, getProducts, getproductById, UpdateProduct, deleteProduct } = require('../controller/productController');
const upload = require('../middleware/imageUpload')
const route = express.Router()

route.post('/addProduct', upload.single('productimage'), addProduct)
route.get('/getProducts', getProducts)
route.get("/getproductById/:id", getproductById)  
route.put('/UpdateProduct/:id', upload.single('productimage'), UpdateProduct)  
route.delete('/deleteProduct/:id', deleteProduct)

=======
const express = require('express');
const { addProduct, getProducts, getproductById, UpdateProduct, deleteProduct } = require('../controller/productController');
const upload = require('../middleware/imageUpload')
const route = express.Router()

route.post('/addProduct', upload.single('productimage'), addProduct)
route.get('/getProducts', getProducts)
route.get("/getproductById/:id", getproductById)  
route.put('/UpdateProduct/:id', upload.single('productimage'), UpdateProduct)  
route.delete('/deleteProduct/:id', deleteProduct)

>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
module.exports = route