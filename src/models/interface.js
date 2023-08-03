// const mongoose = require('mongoose')
// const InterFaceSchema = new mongoose.Schema({
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

//   curr_version: {
//     type: Number,
//     required: true
//   },

//   changeLogs: [
//     {
//       version: {
//         type: Number,
//         required: true
//       },

//       log: {
//         type: String,
//         required: true
//       },

//       update_by: {
//         type: Types.ObjectId,
//         ref: 'user',
//         required: true
//       }
//     }
//   ]
// })

// const interfaceModel = mongoose.model('interface', InterFaceSchema, 'interfaces')
// module.exports = interfaceModel
