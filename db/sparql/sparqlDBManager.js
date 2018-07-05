const {
    SparqlClient,
    SPARQL
} = require('sparql-client-2');

const moment = require('moment');


const endpoint = "https://stad.gent/sparql";
/* const client =
  new SparqlClient('https://stad.gent/sparql')
    .register({
      db: 'http://stad.gent/gentse-feesten-2018/',
      event: "http://schema.org/Event",
      name: "http://schema.org/name",
      startdate: "http://schema.org/startDate",           
    });
 */

const getAllEventsFromNow = () => {
    const date = moment(new Date()).format('YYYY-MM-DD').toString();

    return new SparqlClient(endpoint).query(`
    SELECT * from <http://stad.gent/gentse-feesten-2018/> WHERE {
        ?sub a <http://schema.org/Event> .
        ?sub <http://schema.org/name> ?name.
        ?sub <http://schema.org/startDate> ?startDate.
        FILTER contains(STR(?startDate), ${date} )
      }
    `)
        .execute()
        .then(response => Promise.resolve(response));
}

const getEventsSelectedStageAndDate = (stageName, date) => {
    const convertedDate = moment(date).format('YYYY-MM-DD').toString();

    return new SparqlClient(endpoint).query(`
    SELECT * from <http://stad.gent/gentse-feesten-2018/> WHERE {
        ?event a <http://schema.org/Event> .
        ?event schema:name ?name.
        ?event <http://schema.org/isAccessibleForFree> ?isAccessibleForFree.
        ?event <http://schema.org/location> ?location.
        ?location <http://schema.org/address> ?address.
        ?address <http://schema.org/streetAddress> ?streetAddress.
        filter(str(?isAccessibleForFree) = "true") 
    }
    `)
        .execute()
        .then(response => Promise.resolve(response));
}







module.exports = {
    getAllEventsFromNow,
    getEventsSelectedStageAndDate
}