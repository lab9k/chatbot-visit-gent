const { SparqlClient, SPARQL } = require('sparql-client-2');

const moment = require('moment');

const endpoint = 'https://stad.gent/sparql';
const client = new SparqlClient('https://stad.gent/sparql').register({
  db: 'http://stad.gent/gentse-feesten-2018/',
  event: 'http://schema.org/Event',
  name: 'http://schema.org/name',
  startdate: 'http://schema.org/startDate'
});

const getAllEventsFromNow = () => {
  console.log('test events now');
  const date = moment(new Date('2018-07-18'))
    .set('hour', 9)
    .set('minute', 0)
    .format('YYYY-MM-DD[T]HH:mm')
    .toString();
  const endDate = moment(date)
    .add(1, 'day')
    .set('hour', 5)
    .set('minute', 0)
    .format('YYYY-MM-DD[T]HH:mm')
    .toString();

  console.log('date:', date);

  return new SparqlClient(endpoint)
    .query(SPARQL`
    SELECT ?name ?startDate ?location from <http://stad.gent/gentse-feesten-2018/> WHERE {
            ?sub a <http://schema.org/Event> .
            ?sub <http://schema.org/name> ?name.
            ?sub <http://schema.org/startDate> ?startDate.
            ?sub <http://schema.org/endDate> ?endDate.
            {
                ?sub schema:location/schema:name ?location
            }
            UNION {
                ?sub schema:location/schema:containedInPlace/schema:name ?location
            }
            FILTER (?startDate > "${date}"^^xsd:dateTime )
            FILTER (?endDate < "${endDate}"^^xsd:dateTime )
        }
    `)
    .execute()
    .then((response) => {
      console.log('response', response);
      Promise.resolve(response);
    })
    .catch((error) => {
      console.log('error', error);
    });
};

const getEventsSelectedStageAndDate = (stageName, date) => {
  console.log('converted date issue', date);
  date = new Date(date);
  const convertedDate = moment(date)
    .format('YYYY-MM-DD')
    .toString();
  const startDay = date.getDate();
  const endDay = date.getDate() + 1;
  console.log('converted date', convertedDate);

  console.log('day', startDay);

  const q = `PREFIX schema: <http://schema.org/>
  PREFIX dct:<http://purl.org/dc/terms/>
  SELECT ?name ?startDate ?location from <http://stad.gent/gentse-feesten-2018/> WHERE {
      ?sub a <http://schema.org/Event> .
      ?sub <http://schema.org/name> ?name.
      ?sub <http://schema.org/startDate> ?startDate.
      ?sub <http://schema.org/endDate> ?endDate.
      {
          ?sub schema:location/schema:name ?location
      }
      UNION {
          ?sub schema:location/schema:containedInPlace/schema:name ?location
      }
      FILTER (?startDate > "2018-07-${startDay}T09:00+02:00"^^xsd:dateTime ).
      FILTER (?endDate < "2018-07-${endDay}T05:00+02:00"^^xsd:dateTime ).
      FILTER contains(?location, "${stageName}").
  }`;

  console.log(q);

  return new SparqlClient(endpoint)
    .query(SPARQL(q))
    .execute()
    .catch((error) => {
      console.log('error', JSON.stringify(error));
    });
};

module.exports = {
  getAllEventsFromNow,
  getEventsSelectedStageAndDate
};
