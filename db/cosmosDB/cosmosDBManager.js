const mongoose = require('mongoose');
//DB connection paramaters
const connectionString = process.env.COSMOSDB_CONNECTION_STRING
const dbName = process.env.COSMOSDB_DBNAME
const username = process.env.COSMOSDB_USERNAME
const password = process.env.COSMOSDB_PASSWORD

// schemas for querying db
const Events = require('./models/eventModel');


const testDBconnection = () => {
    //current datetime
    const currentDateTime = new Date(2018,7,15);
    
    mongoose.connect(connectionString, 
            {
                user: username,
                pass: password,
                dbName: dbName
            })
            .then(() => { 
                Events.find(
                    {
                        "startDate": 
                            {
                                "$eq": new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate()) 
                            }
                    },
                    function(err,events) {
                        if(err) throw err;
                        console.log(events) 
                        console.log("length:",events.length)
                    }
                )

            })
            .catch(err => { // if error while connecting with DB
                console.error('App starting error:', err.stack);
                process.exit(1);
            });
}

/* const getAllEventsFromNow = () => {
    //current datetime
    const currentDateTime = new Date();
} */

const getEventsSelectedStageAndDate = (dateTime,stageName) => {
   mongoose.connect(connectionString, 
           {
               user: username,
               pass: password,
               dbName: dbName
           })
           .then(() => { 
               Events.find(
                   {
                       "address": 
                            {
                                "$eq": stageName 
                            },
                        "startDate": 
                           {
                               "$gte": dateTime 
                           },
                        "endDate": 
                           {
                               "$lte": dateTime 
                           }
                   },
                   function(err,events) {
                       if(err) throw err;
                       console.log(events) 
                       console.log("length:",events.length)
                   }
               )

           })
           .catch(err => { // if error while connecting with DB
               console.error('App starting error:', err.stack);
               process.exit(1);
           });
}
 

module.exports = {
    testDBconnection,
    getEventsSelectedStageAndDate
}