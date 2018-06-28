const mongoose = require('mongoose');
//DB connection paramaters
const connectionString = process.env.COSMOSDB_CONNECTION_STRING
const dbName = process.env.COSMOSDB_DBNAME
const username = process.env.COSMOSDB_USERNAME
const password = process.env.COSMOSDB_PASSWORD

// schemas for querying db
const gentseFeestenEvent = require('./models/eventModel');



const testDBconnection = () => {
    mongoose.connect(
            connectionString, 
            {
                user: username,
                pass: password,
                dbName: dbName
            })
            .then(() => { // if all is ok we will be here
                console.log("connected")
            })
            .catch(err => { // if error we will be here
                console.error('App starting error:', err.stack);
                process.exit(1);
            });
        
        
       /*  then((db) => 
            console.log(db)
            db.close()
        ).catch(
            err => console.log(err)
        );


        console.log('********************')
            console.log("Connected to DB");
            db.close(); */
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