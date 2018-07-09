const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//event schema
var eventSchema = new Schema({
    _id : ObjectId,
    eventName: String,
    startDate: String,
    endDate: String,
    address: String,
    description: String,
    image_url: String
},{ collection : 'inventory'});


const Events = mongoose.model("inventory",eventSchema)

module.exports = Events