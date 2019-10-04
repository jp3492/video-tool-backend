const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Request = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user"
  },
  to: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user"
  },
  target: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "type"
  },
  type: {
    type: String,
    required: true,
    enum: ["project", "folder", "user"]
  }
}, { timestamps: true })

const ModelClass = mongoose.model('request', Request)

module.exports = ModelClass