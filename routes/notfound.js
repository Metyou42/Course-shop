const { Router } = require('express');
const NotFoundController = require('../controllers/notfoundControllers');

const router = Router();

router.get('/', NotFoundController.getNotFoundPage);

module.exports = router;
