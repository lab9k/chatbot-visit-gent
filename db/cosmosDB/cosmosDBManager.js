const mongoose = require('mongoose');
//DB connection paramaters
const connectionString = process.env.COSMOSDB_CONNECTION_STRING
const dbName = process.env.COSMOSDB_DBNAME
const username = process.env.COSMOSDB_USERNAME
const password = process.env.COSMOSDB_PASSWORD

// schemas for querying db
const event = require('./models/eventModel');


const testDBconnection = () => {
    mongoose.connect(connectionString, {
        user: username,
        pass: password,
        dbName: dbName
    }, function (err, db) {
        // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
        console.log(db.find().limit(10))
        console.log('********************')
        console.log(event.find().limit(10));
        
        console.log("Connected to DB");
        db.close();
    });
}

/* const getAllEventsFromNow = () => {
    //current datetime
    const currentDateTime = new Date(); 
    
    client.queryDocuments(collectionDefinition, "SELECT * FROM inventory").toArray(function(err, results) {
        if (err) {
            console.log(err)
        } else {
            console.log("it works :)")
            console.log(results);
        }
    });
}

const getEventsSelectedStageAndDate = (dateTime,stage) => {
    client.queryDocuments(collectionDefinition, "SELECT * FROM inventory").toArray(function(err, results) {
        if (err) {
            console.log(err)
        } else {
            console.log("it works :)")
            console.log(results);
        }
    });
}
 */

module.exports = {
    testDBconnection
}