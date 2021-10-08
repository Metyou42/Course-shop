const OrdersService = require('../service/ordersService');

class OrdersController {
  async getOrdersPage(req, res) {
    try {
      const allOrders = await OrdersService.getOrdersPageService(req.userID._id);

      res.render('orders', {
        isOrdersPage: true,
        title: 'Заказы',
        orders: allOrders,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async postOrdersPage(req, res) {
    try {
      await OrdersService.postOrdersPageService(req.userID);

      res.redirect('/orders');
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new OrdersController();
