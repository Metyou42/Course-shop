const Course = require('../model/course');

class CardService {
  static compuPrice(items) {
    return items.reduce((sum, obj) => (sum += obj.count * obj.courseID.price), 0);
  }

  async getCardPageService(userID) {
    if (userID.card.items.length) {
      const card = await userID.populate('card.items.courseID').execPopulate();

      const price = CardService.compuPrice(card.card.items);

      return { card: card.card.items, price };
    }
    return { card: [] };
  }

  async postAddCourseToCardService(courseId, userID) {
    const course = await Course.findById(courseId);
    await userID.addToCard(course);
  }

  async deleteCourseService(courseId, userID) {
    await userID.removeFromCard(courseId);

    const user = await userID.populate('card.items.courseID').execPopulate();
    const userCardItems = user.card.items;

    const card = {
      courses: userCardItems,
      price: CardService.compuPrice(userCardItems),
    };

    return card;
  }
}

module.exports = new CardService();
