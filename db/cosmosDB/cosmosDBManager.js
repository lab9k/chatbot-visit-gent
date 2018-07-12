const mongoose = require('mongoose');
const moment = require('moment');
// DB connection paramaters
const connectionString = process.env.COSMOSDB_CONNECTION_STRING;
const dbName = process.env.COSMOSDB_DBNAME;
const username = process.env.COSMOSDB_USERNAME;
const password = process.env.COSMOSDB_PASSWORD;

// schemas for querying db
const Events = require('./models/eventModel');
const Feedback = require('./models/feedbackModel');

const getAllEventsFromNow = () => {
  mongoose.connect(connectionString, {
    user: username,
    pass: password,
    dbName
  }).then(
    () => {
      console.log('connected to DB');
    },
    (err) => {
      console.log(err);
    }
  );

  // if the current date is not between the start / end date of the Gentse Feesten
  // then get events of first day of Gentse Feesten
  const now = new Date();
  let date;
  if (new Date('2018-07-13') <= now && now <= new Date('2018-07-22')) {
    date = now;
  } else {
    date = new Date('2018-07-13T12:00:00Z');
  }

  const startDate = moment(date).add(-4, 'hour').toISOString();
  const endDate = moment(date).add(4, 'hour').toISOString();

  const query = Events.find({
    startDate: {
      $gte: startDate,
      $lt: endDate
    },
    endDate: {
      $gt: date.toISOString()
    }
  }).sort({
    startDate: 1
  }).limit(7);
  return query;
};

const getEventsSelectedStageAndDate = (dateTimeStart, stageName) => {
  console.log('dateTimeStart', dateTimeStart);
  mongoose.connect(connectionString, {
    user: username,
    pass: password,
    dbName
  }).then(
    () => {
      console.log('connected to DB');
    },
    (err) => {
      console.log(err);
    }
  );

  // set startDate and endDate for event
  const startDate = moment(dateTimeStart).format('YYYY-MM-DD').toString();
  const endDate = moment(dateTimeStart).add(1, 'day').format('YYYY-MM-DD').toString();

  const query = Events.find({
    $or: [
      {
        address: {
          $regex: `${stageName}`,
          $options: 'i'
        }
      },
      {
        squareName: {
          $regex: `${stageName}`,
          $options: 'i'
        }
      }
    ],
    startDate: {
      $gte: startDate,
      $lt: endDate
    }
  }).sort({
    startDate: 1
  }).limit(7);
  return query;
};

const addFeedback = (satisfaction, feedbackImprovement) => {
  mongoose.connect(connectionString, {
    user: username,
    pass: password,
    dbName
  }).then(
    () => {
      console.log('connected to DB');
    },
    (err) => {
      console.log(err);
    }
  );

  Feedback.create({ _id: new mongoose.Types.ObjectId(), satisfaction, feedbackImprovement }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('feedback saved');
    }
  });
};


module.exports = {
  getAllEventsFromNow,
  getEventsSelectedStageAndDate,
  addFeedback
};
