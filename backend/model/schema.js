const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Todo', Schema)
