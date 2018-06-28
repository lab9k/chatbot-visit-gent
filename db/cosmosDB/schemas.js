const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var eventSchema = new Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    address: String,
    description: String,
    image_url: String
});


module.exports = { eventSchema }