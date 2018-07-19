const { SparqlClient } = require('sparql-client-2');

const moment = require('moment');

const endpoint = 'https://stad.gent/sparql';
const client = new SparqlClient(endpoint).register({
  schema: 'http://schema.org/',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#'
});

const getAllEventsFromNow = (square, dateInput) => {
  // console.log('test events now');
  const current = dateInput || new Date();
  const date = moment
    .parseZone(current)
    .add(2, 'hours')
    .format('YYYY-MM-DD[T]HH:mm[+02:00]')
    .toString();
  let endDate = moment
    .parseZone(date)
    .set('hours', 6)
    .set('minutes', 0);

  const shortDate = moment.parseZone(date).format('YYYY-MM-DD');

  // als het nog voor middernacht is, moeten events van na middernacht ook getoond worden
  if (endDate.isBefore(date)) {
    endDate.add(1, 'days');
  }

  endDate = endDate.format('YYYY-MM-DD[T]HH:mm[+02:00]').toString();

  const squareFilter = square ? `FILTER contains(?location, "${square}").` : '';

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
        ?sub schema:location/schema:containedInPlace/schema:name ?location.
        ?sub schema:location/schema:additionalType ?additionalType .
    }
    FILTER (?startDate > "${date}"^^xsd:dateTime && contains(str(?startDate), str("${shortDate}")) || (?startDate <= "${date}"^^xsd:dateTime && ?endDate > "${date}"^^xsd:dateTime )).
    filter (?additionalType = "https://gentsefeesten.stad.gent/api/v1/ns/location-type/square"^^xsd:string).
    ${squareFilter}
  }
  order by ?startDate
`;

  return client
    .query(q)
    .execute()
    .catch((error) => {
      console.log('sparql error', error);
    });
};

const getEventsSelectedStageAndDate = (square, date) => {
  // console.log('converted date issue', date);
  // date = new Date(date);
  const nDate = new Date(date);
  const startDay = moment
    .parseZone(nDate)
    .format('YYYY-MM-DD')
    .toString();
    nDate.setDate(nDate.getDate()+1);
  const endDay = moment
    .parseZone(nDate)
    .format('YYYY-MM-DD')
    .toString();
  //const endDay = nDate.getDate() + 1;

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
        ?sub schema:location/schema:containedInPlace/schema:name ?location .
    }
    FILTER (?startDate > "${startDay}T09:00+02:00"^^xsd:dateTime ).
    FILTER (?endDate < "${endDay}T06:00+02:00"^^xsd:dateTime ).
    FILTER contains(?location, "${square}").
  }
  order by ?startDate
  `;

  console.log(q);

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
