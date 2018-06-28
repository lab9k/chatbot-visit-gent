const DocumentClient = require('documentdb').DocumentClient;
 
const hostname = process.env.COSMOSDB_HOST_NAME                
const masterKey = process.env.COSMOSDB_PRIMARY_PASSWORD  
const client = new DocumentClient(hostname, {"masterKey": masterKey});

var collectionDefinition = { id: "inventory" };



const testDBconnection = () => {
    client.queryDocuments(collectionDefinition, "SELECT * FROM inventory").toArray(function(err, results) {
        if (err) {
            console.log('****************************')
            console.log(hostname)
            console.log(masterKey)
            console.log(err)
            console.log('****************************')
        } else {
            console.log("it works :)")
            console.log(results);
        }
    });
}

const getAllEventsFromNow = () => {
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


module.exports = {
    testDBconnection
}
