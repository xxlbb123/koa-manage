const mongoose = require('mongoose')
// 这里我把必须取消了，因为和我的逻辑有些不合
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
})

const userModel = mongoose.model('user', UserSchema)
module.exports = userModel
