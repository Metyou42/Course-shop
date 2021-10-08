const { Router } = require('express');
const isAuthUser = require('../middleware/authuser');
const CardController = require('../controllers/cardControllers');

const router = Router();

router.post('/add', isAuthUser, CardController.postAddCourseToCard);

router.delete('/remove/:id', isAuthUser, CardController.deleteCourse);

router.get('/', isAuthUser, CardController.getCardPage);

module.exports = router;
