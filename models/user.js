const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,
  },
  password: String,
  salt: String,
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
