const { validationResult } = require('express-validator/check');
const AddService = require('../service/addService');

class AddControllers {
  getAddPage(req, res) {
    res.render('add', {
      title: 'Добавить курс',
      isAddPage: true,
    });
  }

  async addCourse(req, res) {
    try {
      const errors = validationResult(req);

      const validationsFails = await AddService.addCourseService(req.body, req.files[0].path, req.userID, errors);

      if (validationsFails) {
        return res.status(422).render('add', {
          title: 'Добавить курс',
          isAddPage: true,
          titleCourse: req.body.title,
          price: req.body.price,
          invalid: ' invalid',
          helper: 'Что-то пошло не так попробуйте снова позже',
        });
      }

      res.redirect('/courses');
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new AddControllers();
