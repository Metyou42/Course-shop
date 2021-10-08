const { Schema, model } = require('mongoose');

const user = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExp: Date,
  avatarUrl: String,
  card: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseID: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true,
        },
      },
    ],
  },
});

user.methods.addToCard = function (course) {
  const items = [...this.card.items];
  const idx = items.findIndex((c) => c.courseID.toString() === course._id.toString());

  if (idx >= 0) {
    items[idx].count += 1;
  } else {
    items.push({
      count: 1,
      courseID: course._id,
    });
  }

  this.card = { items };

  return this.save();
};

user.methods.removeFromCard = function (id) {
  let items = [...this.card.items];
  const idx = items.findIndex((c) => c.courseID.toString() === id.toString());

  if (items[idx].count === 1) {
    items = items.filter((c) => c.courseID.toString() !== id.toString());
  } else {
    items[idx].count--;
  }

  this.card = { items };

  return this.save();
};

user.methods.clearCard = function () {
  this.card.items = [];

  return this.save();
};

module.exports = model('User', user);
