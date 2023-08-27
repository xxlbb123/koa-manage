const mongoose = require('mongoose')
// hhh
const InterFaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    url: {
      type: String,
      required: true
    },

    http_method: {
      type: String,
      required: true
    },

    query: {
      type: Object
    },

    body: {
      type: Object
    },

    response_data: {
      type: Object,
      required: true
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'project',
      required: true
    }
  },
  { minimize: false }
)

const interfaceModel = mongoose.model('interface', InterFaceSchema, 'interfaces')
module.exports = interfaceModel
