const { Router } = require('express');
const isAuthUser = require('../middleware/authuser');
const { add_editCourse } = require('../utils/validator');
const AddControllers = require('../controllers/addControllers');

const router = Router();

router.get('/', isAuthUser, AddControllers.getAddPage);

router.post('/', isAuthUser, add_editCourse, AddControllers.addCourse);

module.exports = router;
