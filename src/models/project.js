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
    type: Types.ObjectId, //ref userid
    ref: 'user',
    required: true
  },

  members: [
    {
      member: {
        type: Types.ObjectId,
        ref: 'user', // 指向 User 模型的引用
        required: true
      },

      //0：管理 1：读写 2：只读
      permission: {
        type: Number,
        required: true,
        default: 2
      }
    }
  ],

  isPrivate: {
    type: Boolean,
    required: true
  }
})

const projectModel = mongoose.model('project', ProjectSchema, 'projects')
module.exports = projectModel
