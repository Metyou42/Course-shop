const { Router } = require('express');
const isAuthUser = require('../middleware/authuser');
const ProfileController = require('../controllers/profileControllers');

const router = Router();

router.get('/', isAuthUser, ProfileController.getOwnProfilePage);

router.get('/:id', isAuthUser, ProfileController.getOtherProfilePageById);

router.post('/', isAuthUser, ProfileController.postEditProfile);

module.exports = router;
