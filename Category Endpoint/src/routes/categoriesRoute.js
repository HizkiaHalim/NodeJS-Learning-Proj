const express = require('express');
const categories = require('../controllers/categoriesController');
const categoriesMiddleware = require('../middlewares/categoriesMiddleware');

const router = express.Router();

router.get('/', categoriesMiddleware, categories.getAllCategories);

router.get('/:id',categoriesMiddleware, categories.getOneCategory);

router.post('/', categoriesMiddleware, categories.registerCategory);

router.put('/:id',categoriesMiddleware, categories.editCategory);

router.delete('/:id', categoriesMiddleware, categories.deleteCategory);



module.exports = router;