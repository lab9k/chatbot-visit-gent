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

function getEventsByDateAndSquareName(date, squareName) {
    mongoose.connect(connectionString, {
        user: username,
        pass: password,
        dbName: dbName
    }).then(null, error => console.log(error));

    // if the given date is not between the start / end date of the Gentse Feesten
    // then get events of first day of Gentse Feesten
    if (!(new Date("2018-07-13") <= date && date <= new Date("2018-07-22"))) {
        date = new Date("2018-07-13T12:00:00Z");
    }

    let startDate = moment(date).subtract(4, "hour").toISOString();
    let endDate = moment(date).add(4, "hour").toISOString();

    return Events.find({
        $or: [
            (typeof squareName === "undefined") ? {} :
            {
                address: {
                    $regex: `${squareName}`,
                    $options: "i"
                }
            },
            {
                squareName: {
                    $regex: `${squareName}`,
                    $options: "i"
                }
            }
        ],
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
}

function addFeedback(satisfaction, feedbackImprovement) {
    mongoose.connect(connectionString, {
        user: username,
        pass: password,
        dbName: dbName
    }).then(null, error => console.log(error));

    Feedback.create({
        _id: new mongoose.Types.ObjectId(),
        satisfaction: satisfaction,
        feedbackImprovement: feedbackImprovement
    }, (error) => {
        if (error) {
            console.log(error);
        }
    });
}

module.exports = {
    getEventsByDateAndSquareName,
    addFeedback
};
