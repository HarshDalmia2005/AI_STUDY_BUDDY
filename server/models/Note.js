const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  originalImage: { type: String, required: true },
  extractedText: { type: String, default: '' },
  explanation: { type: String, default: '' },
  keyConcepts: [{ type: String }],
  summary: { type: String, default: '' },
  noteLanguage: { type: String, default: 'English' },
  createdAt: { type: Date, default: Date.now }
});

noteSchema.index({ extractedText: 'text', title: 'text' }, { language_override: 'textSearchLang' });

module.exports = mongoose.model('Note', noteSchema);
