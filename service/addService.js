const Course = require('../model/course');

class AddService {
  async addCourseService(body, filePath, userID, errors) {
    const { title, price } = body;

    if (!errors.isEmpty()) {
      console.log(errors.array()[0].msg);
      return { error: true };
    }

    const course = new Course({
      title,
      price,
      img: filePath,
      userID,
      countBuy: 0,
    });

    await course.save();
  }
}

module.exports = new AddService();
