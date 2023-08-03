// const mongoose = require('mongoose')
// const InterFaceRollBackSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },

//   url: {
//     type: String,
//     required: true
//   },

//   http_method: {
//     type: String,
//     required: true
//   },

//   request_params: {
//     type: String,
//     required: true
//   },

//   response_data: {
//     type: String,
//     required: true
//   },

//   project: {
//     type: Types.ObjectId,
//     ref: 'project',
//     required: true
//   },

//   created_by: {
//     type: Types.ObjectId,
//     ref: 'user',
//     required: true
//   },

//   version: {
//     type: Number,
//     required: true
//   }
// })

// const interfaceRollbackModel = mongoose.model('interfaceRollback', InterFaceRollBackSchema, 'interfaceRollbacks')
// module.exports = interfaceRollbackModel
