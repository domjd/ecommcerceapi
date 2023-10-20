const express = require('express');

const router = express.Router();
const orders = require('./order_queries')

router.get('/', orders.getOrders);
router.get('/:id', orders.getOrderById);
router.get('/details/:id', orders.getOrderDetails);

router.post('/', orders.addOrder);

module.exports = router;