const mongoose = require('mongoose');

const weakTopicSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  topic: { type: String, required: true },
  totalAttempts: { type: Number, default: 0 },
  correctAttempts: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  lastAttempted: { type: Date, default: Date.now },
  recommendedRevision: { type: String, default: '' }
});

weakTopicSchema.index({ userId: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('WeakTopic', weakTopicSchema);
