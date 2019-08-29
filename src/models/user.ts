const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Connection = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  status: {
    type: String,
    enum: ['REQUESTED', 'RECEIVED', 'ACCEPTED', 'BLOCKED'],
    required: true
  }
})

const Access = new Schema({
  targetType: {
    type: String,
    enum: ['FOLDER', 'PROJECT']
  },
  targetId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['REQUESTED', 'RECEIVED', 'ACCEPTED', 'BLOCKED'],
    required: true
  }
})

const User = new Schema({
  status: {
    type: String,
    enum: ['INVITED', 'REGISTERED', 'CONFIRMED']
  },
  email: {
    unique: true,
    type: String,
    required: true
  },
  connections: [Connection],
  permissions: [String],
  access: [Access],
  information: {
    firstName: {
      type: String,
      default: ""
    },
    lastName: {
      type: String,
      default: ""
    }
  }
}, { timestamps: true })

const ModelClass = mongoose.model('user', User)

module.exports = ModelClass