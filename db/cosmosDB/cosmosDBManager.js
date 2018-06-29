const mongoose = require('mongoose');
const moment = require('moment');
//DB connection paramaters
const connectionString = process.env.COSMOSDB_CONNECTION_STRING
const dbName = process.env.COSMOSDB_DBNAME
const username = process.env.COSMOSDB_USERNAME
const password = process.env.COSMOSDB_PASSWORD

// schemas for querying db
const Events = require('./models/eventModel');


const getAllEventsFromNow = () => {
    mongoose.connect(connectionString, {
        user: username,
        pass: password,
        dbName: dbName
    }).then(
        () => { console.log("connected to DB") },
        err => { console.log(err) }
    );

    const query = Events.find({
        /* "address": 
             {
                 "$eq": stageName 
             }, */

        /* "startDate": 
        {
            "$gte": startDate/* ,
            "$lt": dateTimeEnd
        } 
        */
    }).limit(5);
    return query;
}

const getEventsSelectedStageAndDate = (dateTimeStart, stageName) => {

    mongoose.connect(connectionString, {
        user: username,
        pass: password,
        dbName: dbName
    }).then(
        () => { console.log("connected to DB") },
        err => { console.log(err) }
    );

    startDate = moment(dateTimeStart)
    endDate = moment(dateTimeStart).add(1, 'day')

    console.log("start:",startDate)
    console.log("end:",endDate)

    const query = Events.find({
        /* "address": 
             {
                 "$eq": stageName 
             }, */

        "startDate": 
        {
            "$gte": startDate ,
            "$lt": dateTimeEnd
        } 
        
    }).limit(5);
    return query;
}


module.exports = {
    getAllEventsFromNow,
    getEventsSelectedStageAndDate
}