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
    const now = new Date();
    const date = moment(new Date("2018-07-18")).format('YYYY-MM-DD').toString();
    const endDate = moment(now).add(1, 'day').format('YYYY-MM-DD').toString();


    return new SparqlClient(endpoint).query(`
    SELECT ?eventName ?startDate ?endDate ?description from <http://stad.gent/gentse-feesten-2018/> WHERE {
        ?sub a <http://schema.org/Event> .
        ?sub <http://schema.org/name> ?eventName.
        ?sub <http://schema.org/description> ?description.
        ?sub <http://schema.org/startDate> ?startDate.
        ?sub <http://schema.org/endDate> ?endDate.
        ?sub <http://schema.org/location> ?location.
        ?location <http://schema.org/address> ?address. 
        ?address <http://schema.org/streetAddress> ?streetAddress.
        ?location <http://schema.org/address> ?name. 
        FILTER ((?startDate >= ${date}^^xsd:dateTime && ?endDate < ${endDate}^^xsd:dateTime))
    }
    `)
        .execute()
        .then(response => Promise.resolve(response));
}

const getEventsSelectedStageAndDate = (stageName, date) => {
    const convertedDate = moment(date).format('YYYY-MM-DD').toString();

    return new SparqlClient(endpoint).query(`
    SELECT ?eventName ?startDate ?endDate ?description from <http://stad.gent/gentse-feesten-2018/> WHERE {
        ?sub a <http://schema.org/Event> .
        ?sub <http://schema.org/name> ?eventName.
        ?sub <http://schema.org/description> ?description.
        ?sub <http://schema.org/startDate> ?startDate.
        ?sub <http://schema.org/endDate> ?endDate.
        ?sub <http://schema.org/location> ?location.
        ?location <http://schema.org/address> ?address. 
        ?address <http://schema.org/streetAddress> ?streetAddress.
        ?location <http://schema.org/address> ?name. 
        FILTER ((contains(lcase(STR(?streetAddress)), ${stageName}) || contains(lcase(STR(?name)), ${stageName})) && (?startDate >= ${convertedDate}^^xsd:dateTime && ?endDate < ${convertedDate}^^xsd:dateTime))
    }
    `)
        .execute()
        .then(response => Promise.resolve(response));
}



module.exports = {
    getAllEventsFromNow,
    getEventsSelectedStageAndDate
}