const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model("user", UserSchema, "users");
module.exports = userModel;
