const mongoose = require('mongoose');
const moment = require('moment');
const assert = require('assert');
//DB connection paramaters
const connectionString = process.env.COSMOSDB_CONNECTION_STRING
const dbName = process.env.COSMOSDB_DBNAME
const username = process.env.COSMOSDB_USERNAME
const password = process.env.COSMOSDB_PASSWORD

// schemas for querying db
const Events = require('./models/eventModel');
const Feedback = require('./models/feedbackModel');

const getAllEventsFromNow = () => {
    mongoose.connect(connectionString, {
        user: username,
        pass: password,
        dbName: dbName
    }).then(
        () => {
            console.log("connected to DB")
        },
        err => {
            console.log(err)
        }
    );

    now = new Date();

    //startDate = current date with hours and minutes
    var startDate = moment(now).format('YYYY-MM-DD HH:mm').toString();
    //endDate = add day to currentDate
    var endDate = moment(now).add(1, 'day').format('YYYY-MM-DD').toString();

    //console.log(startDate)
    //console.log(endDate)


    const query = Events.find({
        "startDate": {
            "$gte": startDate,
            "$lt": endDate
        }
    }).sort({
        startDate: 1
    }).limit(5);
    return query;
}

const getEventsSelectedStageAndDate = (dateTimeStart, stageName) => {
    console.log("dateTimeStart", dateTimeStart);
    mongoose.connect(connectionString, {
        user: username,
        pass: password,
        dbName: dbName
    }).then(
        () => {
            console.log("connected to DB")
        },
        err => {
            console.log(err)
        }
    );

    //set startDate and endDate for event
    var startDate = moment(dateTimeStart).format('YYYY-MM-DD').toString();
    var endDate = moment(dateTimeStart).add(1, 'day').format('YYYY-MM-DD').toString();

    const query = Events.find({
        "address": {
            '$regex': `${stageName}`,
            '$options': 'i'
        },
        "startDate": {
            "$gte": startDate,
            "$lt": endDate
        }
    }).sort({
        startDate: 1
    }).limit(5)
    return query;
}

const addFeedback = (satisfaction, feedbackImprovement) => {
    mongoose.connect(connectionString, {
        user: username,
        pass: password,
        dbName: dbName
    }).then(
        () => {
            console.log("connected to DB")
        },
        err => {
            console.log(err)
        }
    );
    
    const feedback = new Feedback(Number(satisfaction),feedbackImprovement);
    
    return feedback.save(function (err) {
        if (err) return handleError(err);
        console.log("saved :) ")
    })

}


module.exports = {
    getAllEventsFromNow,
    getEventsSelectedStageAndDate,
    addFeedback
}