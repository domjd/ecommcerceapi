const express = require('express');

const router = express.Router();

const products = require('./product_queries');

router.get('/', products.getProducts);
router.get('/:id', products.getProductById);
router.get('/category/:id', products.getProductByCategoryId);

router.post('/', products.addProduct);

router.put('/:id', products.updateProduct);

router.delete('/:id', products.deleteProduct)

module.exports = router;