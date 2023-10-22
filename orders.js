const express = require('express');

const router = express.Router();
const orders = require('./queries/order_queries')

router.get('/', orders.getOrders);
router.get('/:id', orders.getOrderById);
router.get('/details/:id', orders.getOrderDetails);

router.post('/', orders.addOrder);

router.put('/:id', orders.updateOrder);

router.delete('/:id', orders.deleteOrder);

module.exports = router;