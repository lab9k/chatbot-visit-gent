const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    address: String,
    description: String,
    image_url: String
});

const Events = mongoose.model("Events",eventSchema)


module.exports = { Events }