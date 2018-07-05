const {
    SparqlClient,
    SPARQL
} = require('sparql-client-2');

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

    return new SparqlClient(endpoint).query(`
    SELECT * from <http://stad.gent/gentse-feesten-2018/> WHERE {
        ?sub a <http://schema.org/Event> .
        ?sub <http://schema.org/name> ?name.
        ?sub <http://schema.org/startDate> ?startDate.
        FILTER contains(STR(?startDate), "2018-07-21" )
      }
    `)
    .execute()
    .then(response => Promise.resolve(response));
    


   /*  return client
        .query(SPARQL `
           SELECT *
           WHERE {
             ${{db: cityName}} dbpedia:leaderName ?leaderName
        

             FILTER contains(STR(?startDate), "2018-07-21" )
           }`)
        .execute()
        // Get the items we want.
        .then(response => Promise.resolve(response.results.bindings[0].leaderName.value)); */
}

/* SELECT * from <http://stad.gent/gentse-feesten-2018/> WHERE {
  ?sub a <http://schema.org/Event> .
  ?sub <http://schema.org/name> ?name.
  ?sub <http://schema.org/startDate> ?startDate.
  FILTER contains(STR(?startDate), "2018-07-21" )
} */

/* const getEventsSelectedStageAndDate = (stageName,date) => {
    return client
      .query(SPARQL`
             SELECT ?leaderName
             WHERE {
               ${{db: cityName}} dbpedia:leaderName ?leaderName
             }`)
      .execute()
      // Get the items we want.
      .then(response => Promise.resolve(response.results.bindings[0].leaderName.value));
  } */




//fetchCityLeader('Vienna')
//  .then(leader => console.log(`${leader} is a leader of Vienna`));





module.exports = {
    getAllEventsFromNow,
    getEventsSelectedStageAndDate
}