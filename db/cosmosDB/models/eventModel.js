const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose.Schema;

// event schema
const eventSchema = new Schema(
  {
    _id: ObjectId,
    eventName: String,
    startDate: String,
    endDate: String,
    address: String,
    description: String,
    image_url: String
  },
  { collection: 'inventory' }
);

const Events = mongoose.model('inventory', eventSchema);

module.exports = Events;
