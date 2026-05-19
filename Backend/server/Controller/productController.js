const productTable = require('../models/ProductModel');

const addProduct = async (req, res) => {
    try {
        const { name, description, price, quantity, categoryId } = req.body
        const pimage = req.file ? req.file.filename : null

        const productDetails = new productTable({ 
            name, 
            description, 
            price, 
            quantity, 
            categoryId, 
            productimage: pimage   
        })
        await productDetails.save()

        res.status(201).json({ message: "Product added successfully", pdata: productDetails })
    } catch (error) {
        console.error("Error adding product:", error)
        res.status(500).json({ message: "Server error", error })
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await productTable.find().populate('categoryId') // ✅ Fix: populate categoryId
        res.status(200).json({ message: "Products retrieved successfully", pdata: products })
    } catch (error) {
        console.error("Error retrieving products:", error)
        res.status(500).json({ message: "Server error", error })
    }
}

const getproductById = async (req, res) => {
    try {
        const id = req.params.id
        const product = await productTable.findById(id).populate('categoryId')  // ✅ productTable not usertable

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        res.status(200).json({ message: "Product fetched successfully", pdata: product })  // ✅ pdata not byid
    } catch (error) {
        console.error("Error fetching product:", error)
        res.status(500).json({ message: "Server error", error })
    }
}

const UpdateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, price, quantity, categoryId } = req.body
        const pimage = req.file ? req.file.filename : undefined

        const updateData = { name, description, price, quantity, categoryId }
        if (pimage) {
            updateData.productimage = pimage
        }

        const updatedProduct = await productTable.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" })
        }

        res.status(200).json({ message: "Product updated successfully", pdata: updatedProduct })
    } catch (error) {
        console.error("Error updating product:", error)
        res.status(500).json({ message: "Server error", error })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const deletedProduct = await productTable.findByIdAndDelete(id)

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" })
        }

        res.status(200).json({ message: "Product deleted successfully", pdata: deletedProduct })
    } catch (error) {
        console.error("Error deleting product:", error)
        res.status(500).json({ message: "Server error", error })
    }
}

module.exports = { addProduct, getProducts, getproductById,UpdateProduct, deleteProduct }