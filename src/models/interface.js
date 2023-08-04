const mongoose = require('mongoose')
const InterFaceSchema = new mongoose.Schema({
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
    type: Object,
    required: true
  },

  body: {
    type: Object,
    required: true
  },

  response_data: {
    type: Object,
    required: true
  }
})

const interfaceModel = mongoose.model('interface', InterFaceSchema, 'interfaces')
module.exports = interfaceModel
