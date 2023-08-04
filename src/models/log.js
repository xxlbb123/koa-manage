const mongoose = require('mongoose')
const LogSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'project',
    required: true
  },

  current_version: {
    type: Number,
    required: true
  },

  interfaces: [
    {
      interface: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'interface',
        required: true
      },

      update_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },

      update_time: {
        type: Date,
        required: true
      }
    }
  ]
})

const logModel = mongoose.model('log', LogSchema, 'logs')
module.exports = logModel
