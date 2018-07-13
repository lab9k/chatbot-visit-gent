const { SparqlClient, SPARQL } = require('sparql-client-2');

const moment = require('moment');

const endpoint = 'https://stad.gent/sparql';
const client = new SparqlClient('https://stad.gent/sparql').register({
  db: 'http://stad.gent/gentse-feesten-2018/',
  dct: 'http://purl.org/dc/terms/',
  schema: 'http://schema.org/',
  startdate: 'http://schema.org/startDate'
});

const getAllEventsFromNow = (square) => {
  //console.log('test events now');
  const date = moment.parseZone(new Date('2018-07-18'))
  .format('YYYY-MM-DD[T]HH:mm[+02:00]')
    .toString();
  let endDate = moment.parseZone(date)
    .set('hour', 6)
    .set('minute', 0)
    .format('YYYY-MM-DD[T]HH:mm[+02:00]')
    .toString();

  if(endDate < date){
    endDate.add(1, 'day');    
  }

  //console.log('date:', date);
  const squareFilter = square ? `FILTER contains(?location, "${square}").`: "" ;

  const q = `SELECT ?name ?startDate ?endDate ?image ?location ?description from <http://stad.gent/gentse-feesten-2018/> WHERE {
    ?sub a <http://schema.org/Event> .
    ?sub <http://schema.org/name> ?name.
    ?sub <http://schema.org/startDate> ?startDate.
    ?sub <http://schema.org/endDate> ?endDate.
    optional { ?sub schema:image/schema:url ?image. }
    optional { ?sub <http://schema.org/description> ?description. }
    {
        ?sub schema:location/schema:name ?location
    }
    UNION {
        ?sub schema:location/schema:containedInPlace/schema:name ?location
    }
    FILTER (?startDate > "${date}"^^xsd:dateTime ).
    FILTER (?endDate < "${endDate}"^^xsd:dateTime ).
    ${squareFilter}
  }
  order by ?startDate
`;

  //console.log("query events now", q);

  return client
    .query(q)
    .execute()
    .catch((error) => {
      console.log('sparql error', error);
    });
};

const getEventsSelectedStageAndDate = (square, date) => {
  //console.log('converted date issue', date);
  date = new Date(date);
  const convertedDate = moment.parseZone(date)
    .format('YYYY-MM-DD')
    .toString();
  const startDay = date.getDate();
  const endDay = date.getDate() + 1;
  //console.log('converted date', convertedDate);

  //console.log('day', startDay);

  const q = `SELECT ?name ?startDate ?endDate ?image ?description from <http://stad.gent/gentse-feesten-2018/> WHERE {
    ?sub a <http://schema.org/Event> .
    ?sub <http://schema.org/name> ?name.
    ?sub <http://schema.org/startDate> ?startDate.
    ?sub <http://schema.org/endDate> ?endDate.
    optional { ?sub schema:image/schema:url ?image. }
    optional { ?sub <http://schema.org/description> ?description. }
    {
        ?sub schema:location/schema:name ?location
    }
    UNION {
        ?sub schema:location/schema:containedInPlace/schema:name ?location
    }
    FILTER (?startDate > "2018-07-${startDay}T09:00+02:00"^^xsd:dateTime ).
    FILTER (?endDate < "2018-07-${endDay}T05:00+02:00"^^xsd:dateTime ).
    FILTER contains(?location, "${square}").
  }
  order by ?startDate
  `;

  //console.log(q);

  return client
    .query(q)
    .execute()
    .catch((error) => {
      console.log('sparQL error', JSON.stringify(error));
    });
};

module.exports = {
  getAllEventsFromNow,
  getEventsSelectedStageAndDate
};
