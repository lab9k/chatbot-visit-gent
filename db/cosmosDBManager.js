const DocumentClient = require('documentdb').DocumentClient;
 
const hostname = process.env.COSMOSDB_HOST_NAME                
const masterKey = process.env.COSMOSDB_PRIMARY_PASSWORD  
const client = new DocumentClient(hostname, {"masterKey": masterKey});


const testDBconnection = () => {
    client.queryDocuments(collection._self, "SELECT * FROM inventory").toArray(function(err, results) {
        if (err) {
            console.log(err)
        } else {
            console.log("it works :)")
            console.log(results);
        }
    });
}


module.exports = testDBconnection;