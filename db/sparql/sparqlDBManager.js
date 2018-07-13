const { SparqlClient } = require('sparql-client-2');

const moment = require('moment');

const endpoint = 'https://stad.gent/sparql';
const client = new SparqlClient(endpoint).register({
  db: 'http://stad.gent/gentse-feesten-2018/',
  dct: 'http://purl.org/dc/terms/',
  schema: 'http://schema.org/',
  startdate: 'http://schema.org/startDate'
});

const getAllEventsFromNow = (square) => {
  // console.log('test events now');
  const dummyDate = new Date('2018-07-13T17:00+02:00');
  const date = moment
    .parseZone(dummyDate)
    .format('YYYY-MM-DD[T]HH:mm[+02:00]')
    .toString();
  let endDate = moment
    .parseZone(date)
    .set('hours', 6)
    .set('minutes', 0);

  const shortDate = moment.parseZone(dummyDate).format("'YYYY-MM-DD");

  // als het nog voor middernacht is, moeten events van na middernacht ook getoond worden
  if (endDate.isBefore(date)) {
    endDate.add(1, 'days');
  }

  endDate = endDate.format('YYYY-MM-DD[T]HH:mm[+02:00]').toString();

  // console.log('date:', date);
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

  console.log('query events now', q);

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
  const convertedDate = moment
    .parseZone(nDate)
    .format('YYYY-MM-DD')
    .toString();
  const startDay = nDate.getDate();
  const endDay = nDate.getDate() + 1;
  console.log('db date', nDate);

  console.log('day', startDay);

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
    FILTER (?startDate > "${convertedDate}T09:00+02:00"^^xsd:dateTime ).
    FILTER (?endDate < "2018-07-${endDay}T05:00+02:00"^^xsd:dateTime ).
    FILTER contains(?location, "${square}").
  }
  order by ?startDate
  `;

  // console.log(q);

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
