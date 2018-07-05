const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//event schema
var feedbackSchema = new Schema({
    _id : new ObjectId(),
    satisfaction: { type: Number, min: -1, max: 1 },
    feedbackImprovement: String
},{ collection : 'feedback'});


const Feedback = mongoose.model("feedback",feedbackSchema)

module.exports = Feedback