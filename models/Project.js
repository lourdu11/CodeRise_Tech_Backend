const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  images: {
    type: [String],
    default: []
  },
  tech: {
    type: [String],
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  useCase: {
    type: String,
    required: false
  },
  developer: {
    type: String,
    required: false
  },
  demoUrl: {
    type: String,
    default: ""
  },
  githubUrl: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
