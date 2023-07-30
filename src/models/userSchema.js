const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
})

const userModel = mongoose.model('user', UserSchema)
module.exports = userModel
