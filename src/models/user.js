const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Access = new Schema({
  targetType: {
    type: String,
    required: true,
    enum: ['folder', 'project']
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "targetType"
  }
})

const User = new Schema({
  status: {
    type: String,
    enum: ['INVITED', 'REGISTERED', 'CONFIRMED'],
    default: 'REGISTERED'
  },
  cognitoId: {
    type: String,
    required: true
  },
  email: {
    unique: true,
    type: String,
    required: true
  },
  connections: [{
    type: Schema.Types.ObjectId,
    ref: "user"
  }],
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