const { Router } = require('express');
const isAuthUser = require('../middleware/authuser');
const OrdersController = require('../controllers/ordersControllers');

const router = Router();

router.get('/', isAuthUser, OrdersController.getOrdersPage);

router.post('/', isAuthUser, OrdersController.postOrdersPage);

module.exports = router;
