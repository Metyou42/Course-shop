const { validationResult } = require('express-validator/check');
const CoursesService = require('../service/coursesService');

class CoursesController {
  async getCoursesPage(req, res) {
    try {
      const course = await CoursesService.getCoursesPageService();

      res.render('courses', {
        title: 'Все курсы',
        isCoursesPage: true,
        course,
        userID: req.userID ? req.userID._id : null,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getEditCoursePage(req, res) {
    try {
      if (!req.query.allow) return res.redirect('/');
      const { course, img } = await CoursesService.getEditCoursePageService(req.params.id, req.userID._id);
      if (course) {
        return res.render('course-edit', {
          title: `Редактировать курс ${course.title}`,
          course,
          img,
        });
      }

      res.redirect('/*');
    } catch (e) {
      console.log(e);
    }
  }

  async getCoursePageById(req, res) {
    try {
      const course = await CoursesService.getCoursePageByIdService(req.params.id);

      res.render('course', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async postEditCourse(req, res) {
    try {
      const errors = validationResult(req);

      const error = await CoursesService.postEditCourseService(req.body, req.userID._id, req.files[0], errors);
      if (error) {
        const { error, title, img } = error;
        return res.status(422).render('course-edit', {
          title: `Редактировать курс ${title}`,
          invalid: ' invalid',
          helper: 'Что-то пошло не так попробуйте снова позже',
          course: req.body,
          img,
        });
      }

      res.redirect('/courses');
    } catch (e) {
      console.log(e);
    }
  }

  async deleteCourse(req, res) {
    try {
      const error = await CoursesService.deleteCourseService(req.body.id, req.userID._id);
      if (error) return res.redirect('/*');

      res.redirect('/courses');
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new CoursesController();
