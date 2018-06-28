const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


var eventSchema = new Schema({
    _id : ObjectId,
    name: String,
    startDate: Date,
    endDate: Date,
    address: String,
    description: String,
    image_url: String
});

const Events = mongoose.model("inventory",eventSchema)


module.exports = Events