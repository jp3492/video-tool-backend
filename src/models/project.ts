const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Project = new Schema({
  label: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  folder: {
    type: Schema.Types.ObjectId,
    ref: 'folder'
  },
  links: [{
    url: String,
    label: String
  }],
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'tag'
  }]
}, { timestamps: true })

const ModelClass = mongoose.model('project', Project)

module.exports = ModelClass