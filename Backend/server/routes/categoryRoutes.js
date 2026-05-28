<<<<<<< HEAD
const express = require('express');
const router = express.Router();

const { addCategory, getCategory, getCategoryById, deleteCategoryById, UpdateCategoryById } = require('../controller/categoryController'); // ✅ FIXED

router.post('/addCategory', addCategory);
router.get('/getCategory', getCategory);
router.get('/getCategoryById/:id', getCategoryById);
router.delete('/deleteCategoryById/:id', deleteCategoryById);
router.put('/UpdateCategoryById/:id', UpdateCategoryById);

module.exports = router;
=======
const express = require('express');
const router = express.Router();

const { addCategory, getCategory, getCategoryById, deleteCategoryById, UpdateCategoryById } = require('../controller/categoryController'); // ✅ FIXED

router.post('/addCategory', addCategory);
router.get('/getCategory', getCategory);
router.get('/getCategoryById/:id', getCategoryById);
router.delete('/deleteCategoryById/:id', deleteCategoryById);
router.put('/UpdateCategoryById/:id', UpdateCategoryById);

module.exports = router;
>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
// console.log("Category routes working");