const { Router } = require('express');
const HomeController = require('../controllers/homeControllers');

const router = Router();

router.get('/', HomeController.getHomePage);

module.exports = router;
