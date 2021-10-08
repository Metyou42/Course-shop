const ProfileService = require('../service/profileService');

class ProfileController {
  async getOwnProfilePage(req, res) {
    try {
      const course = await ProfileService.getOwnProfilePageService(req.userID._id);

      res.render('profile', {
        title: 'Профиль',
        isProfilePage: true,
        user: req.userID.toObject(),
        course,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getOtherProfilePageById(req, res) {
    try {
      const {
        name, user, course, own,
      } = await ProfileService.getOtherProfilePageByIdService(req.params.id, req.userID._id);
      if (own) return res.redirect('/profile');

      res.render('publicProfile', {
        title: `Профиль ${name}`,
        user,
        course,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async postEditProfile(req, res) {
    try {
      await ProfileService.postEditProfileService(req.userID._id, req.body.name, req.files[0]);
      res.redirect('/profile');
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new ProfileController();
