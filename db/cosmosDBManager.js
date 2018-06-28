const DocumentClient = require('documentdb').DocumentClient;

const hostname = process.env.COSMOSDB_HOST_NAME
const masterKey = process.env.COSMOSDB_PRIMARY_PASSWORD
const client = new DocumentClient(hostname, {
    masterKey: masterKey
});





const testDBconnection = () => {
    const querySpec = "SELECT * FROM inventory"
    client.queryDatabases(querySpec).toArray((err, results) => {
        if (err) {
            console.log(err);
        } else {
            if (results.length === 0) {
                console.log("***************")
                console.log("results is empty")
                console.log("***************")
            } else {
                console.log("QUERY RESULTS:")
                console.log(results)
            }
        }
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