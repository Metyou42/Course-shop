const Order = require('../model/orders');
const Course = require('../model/course');

class OrdersService {
  async getOrdersPageService(UserId) {
    const orders = await Order.find({ 'user.userID': UserId }).populate('user.userID');

    const allOrders = orders.map((o) => ({
      ...o._doc,
      price: o.courses.reduce((total, c) => (total += c.count * c.course.price), 0),
    }));

    return allOrders;
  }

  async postOrdersPageService(UserID) {
    const user = await UserID.populate('card.items.courseID').execPopulate();

    const courses = await Promise.all(
      user.card.items.map(async (i) => {
        const buycoursesIdarr = await Course.findById(i.courseID._id);

        buycoursesIdarr.countBuy += +i.count;
        await buycoursesIdarr.save();

        return {
          count: i.count,
          course: { ...i.courseID },
        };
      }),
    );

    const order = new Order({
      courses,
      user: {
        name: user.name,
        userID: user._id,
      },
    });

    await order.save();
    await UserID.clearCard();
  }
}

module.exports = new OrdersService();
