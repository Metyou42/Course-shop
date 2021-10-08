const CardService = require('../service/cardService');

class CardController {
  async getCardPage(req, res) {
    try {
      const massage = {
        isCardPage: true,
        title: 'Корзина',
      };

      const render = await CardService.getCardPageService(req.userID);

      res.render('card', Object.assign(massage, render));
    } catch (e) {
      console.log(e);
    }
  }

  async postAddCourseToCard(req, res) {
    try {
      await CardService.postAddCourseToCardService(req.body.id, req.userID);
      res.redirect('/card');
    } catch (e) {
      console.log(e);
    }
  }

  async deleteCourse(req, res) {
    try {
      const card = await CardService.deleteCourseService(req.params.id, req.userID);
      res.status(200).json(card);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new CardController();
