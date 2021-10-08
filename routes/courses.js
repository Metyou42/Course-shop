const { Router } = require('express');
const isAuthUser = require('../middleware/authuser');
const { add_editCourse } = require('../utils/validator');
const CoursesController = require('../controllers/coursesControllers');

const router = Router();

router.get('/', CoursesController.getCoursesPage);

router.get('/:id/edit', isAuthUser, CoursesController.getEditCoursePage);

router.post('/edit', isAuthUser, add_editCourse, CoursesController.postEditCourse);

router.post('/delete', isAuthUser, CoursesController.deleteCourse);

router.get('/:id', CoursesController.getCoursePageById);

module.exports = router;
