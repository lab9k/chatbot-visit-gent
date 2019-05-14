const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

// event schema
const feedbackSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    satisfaction: { type: Number, min: -1, max: 1 },
    feedbackImprovement: String
  },
  { collection: 'feedback' }
);

const Feedback = mongoose.model('feedback', feedbackSchema);

module.exports = Feedback;
