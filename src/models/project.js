const mongoose = require('mongoose')
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  created_by: {
    type: mongoose.Schema.Types.ObjectId, //ref userid
    ref: 'user',
    required: true
  },

  members: [
    {
      member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // 指向 User 模型的引用
        required: true
      },

      //0：管理 1：读写 2：只读
      permission: {
        type: Number,
        required: true,
        default: 2
      },
      // 用户名称
      username: {
        type: String,
        required: true
      }
    }
  ],

  isPrivate: {
    type: Boolean,
    required: true
  },

  created_time: {
    type: Date,
    required: true
  }
})

const projectModel = mongoose.model('project', ProjectSchema, 'projects')
module.exports = projectModel
