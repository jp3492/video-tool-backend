const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Tag = new Schema({
  text: String,
  start: Number,
  end: Number,
  url: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true })

const ModelClass = mongoose.model('tag', Tag)

module.exports = ModelClass