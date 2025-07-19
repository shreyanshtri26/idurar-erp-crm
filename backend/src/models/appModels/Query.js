const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String }, // Optionally, link to a User model
  createdAt: { type: Date, default: Date.now }
});

const QuerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  resolution: { type: String },
  notes: [NoteSchema],
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Query', QuerySchema); 