const { unlink } = require('fs');
const Course = require('../model/course');

class CoursesService {
  static isOwner(courseOwnUserId, userId) {
    return courseOwnUserId.toString() === userId.toString();
  }

  async getCoursesPageService() {
    const course = await Course.find();
    return course;
  }

  async getEditCoursePageService(CourseId, UserId) {
    const course = await Course.findById(CourseId);

    if (CoursesService.isOwner(course.userID, UserId)) {
      const img = course.img.split('').slice(25, course.img.length).join('');
      return { course, img };
    }
  }

  async getCoursePageByIdService(CourseID) {
    const course = await Course.findById(CourseID);
    return course;
  }

  async postEditCourseService(body, UserId, file, errors) {
    const { title, price, id } = body;
    const course = await Course.findById(id);
    if (!errors.isEmpty() || !CoursesService.isOwner(course.userID, UserId)) {
      if (!errors.isEmpty()) console.log(errors.array()[0].msg);
      const img = course.img.split('').slice(25, course.img.length).join('');
      return { error: true, title, img };
    }

    const toChange = {
      title,
      price,
    };

    if (file) {
      toChange.img = file.path;
      unlink(`../Node express/${course.img}`, (err) => {
        if (err) throw err;
      });
    }

    Object.assign(course, toChange);
    await course.save();
  }

  async deleteCourseService(CourseId, UserId) {
    const course = await Course.findById(CourseId);

    if (!CoursesService.isOwner(course.userID, UserId)) return { error: true };

    unlink(`../Node express/${course.img}`, (err) => {
      if (err) throw err;
    });

    await Course.deleteOne({
      _id: CourseId,
      userID: UserId,
    });
  }
}

module.exports = new CoursesService();
