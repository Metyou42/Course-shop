const { unlink } = require('fs');
const User = require('../model/user');
const Course = require('../model/course');

class ProfileService {
  async getOwnProfilePageService(userId) {
    const course = await Course.find({ userID: userId });
    return course;
  }

  async getOtherProfilePageByIdService(ReqParamsId, ReqUserId) {
    const user = await User.findById(ReqParamsId);
    if (user._id.toString() === ReqUserId.toString()) return { own: true };

    const course = await Course.find({ userID: user._id });
    return {
      name: user.name, user: user.toObject(), course, own: false,
    };
  }

  async postEditProfileService(userId, name, file) {
    const user = await User.findById(userId);
    const toChange = { name };

    if (file) {
      if (user.avatarUrl) {
        unlink(`../Node express/${user.avatarUrl}`, (err) => {
          if (err) throw err;
        });
      }
      toChange.avatarUrl = file.path;
    }

    Object.assign(user, toChange);
    await user.save();
  }
}

module.exports = new ProfileService();
