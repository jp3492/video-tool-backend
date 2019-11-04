const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Tag = new Schema(
  {
    text: String,
    start: Number,
    end: Number,
    url: String,
    author: String,
    comments: [Comment]
  },
  { timestamps: true }
);

const ModelClass = mongoose.model('tag', Tag);

module.exports = ModelClass;
