const express = require('express');

const router = express.Router();

const carts = require('./queries/cart_queries');

router.get('/', carts.getCarts);
router.get('/:id', carts.getCartById);

router.post('/:id/checkout', carts.checkout);

router.delete('/:id', carts.deleteCart)

module.exports = router;