// Router for API
const router = require('express').Router();
const mw = require('../../util/middleware');

// Models for messenger
const Card = require('../../models/card');
const Button = require('../../models/button');
const CardButton = require('../../models/cardButton');
const QuickReply = require('../../models/quickReply');
const generate_navigate_button = require('../../models/navigateButton');
const Payload = require('../../models/payload');
const Attachment = require('../../models/attachtment');

// Location mappers
const LocationMapper = require('../../util/locationmapper');
const location = require('../../util/location');

const locationMapper = new LocationMapper();

// Utils
const util = require('../../util/util');

// Database managers
const cosmosDB = require('../../db/cosmosDB/cosmosDBManager');

// Date conversions
const moment = require('moment');

// General images of Gentse Feesten
const images = [
  'https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/gentsefeesten/1.jpg',
  'https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/gentsefeesten/2.jpg',
  'https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/gentsefeesten/3.jpg',
  'https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/gentsefeesten/4.jpg',
  'https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/gentsefeesten/5.jpg',
  'https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/gentsefeesten/6.jpg',
  'https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/gentsefeesten/7.jpg',
  'https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/gentsefeesten/8.jpg'
];

// Intent actions
router.all('/', mw.typeMiddleware, (req, res, next) => {
  let fn;
  switch (req.type) {
    case 'get_plein_location':
      fn = getClosestStage;
      break;
    case 'get_events':
      fn = getEventsSquareForDate;
      break;
    case 'all_squares':
      fn = getAllSquares;
      break;
    case 'toiletten.search':
      fn = getClosestToilet;
      break;
    case 'feedback.satisfaction':
      fn = feedbackSatisfaction;
      break;
    case 'plein_card':
      fn = getSquareCard;
      break;
    case 'get_days':
      fn = getDaysGF;
      break;
    case 'get.events.now':
      fn = getEventsGFNow;
      break;
    case 'get_events_today':
      fn = getEventsForToday;
      break;
    case 'get_now':
      fn = getCurrentEventFor;
      break;
    default:
      return next(new Error(`type not defined: ${req.type}, action: ${req.body.queryResult.action}`));
  }
  return fn(req, res, next);
});

function feedbackSatisfaction(req) {
  const improvementProposal = req.body.queryResult.parameters.improvement_proposal;
  switch (req.body.queryResult.parameters.satisfaction) {
    case 'tevreden':
      cosmosDB.addFeedback(1, improvementProposal);
      break;
    case 'neutraal':
      cosmosDB.addFeedback(0, improvementProposal);
      break;
    case 'niet tevreden':
      cosmosDB.addFeedback(-1, improvementProposal);
      break;
    default:
      break;
  }
}

function getClosestStage(req, res) {
  const { payload } = req.body.originalDetectIntentRequest;
  const { lat, long } = payload.data.postback.data;
  const squares = locationMapper.getSquares();
  const nearest = location.closestLocation({ lat, long }, squares);
  const urlName = nearest.name.nl.split(' ').join('_');
  const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${long}&destination=${nearest.lat},
                ${nearest.long}&travelmode=walking`;
  const card = new Card(
    `https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/pleinen/${urlName}.jpg`,
    `${nearest.name.nl}`,
    'Klik op één van de volgende knoppen om te navigeren of het programma te bekijken.',
    [
      new CardButton('Programma', `Programma ${nearest.name.nl}`, 'postback'),
      new Button('Toon mij de weg', url, 'web_url'),
      new CardButton('Terug naar hoofdmenu', 'menu', 'postback')
    ],
    url
  );
  return res.json(new Payload(new Attachment([card])));
}

function getClosestToilet(req, res) {
  const { payload } = req.body.originalDetectIntentRequest;
  const { lat, long } = payload.data.postback.data;
  const nearest = location.closestLocation({ lat, long }, locationMapper.getToilets());
  const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${long}&destination=${nearest.lat},
                ${nearest.long}&travelmode=walking`;
  const card = new Card(
    'https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/toilet/toilet.jpg',
    'Dichtstbijzijnde toilet',
    '',
    [
      generate_navigate_button(url),
      new CardButton('Terug naar hoofdmenu', 'menu', 'postback')
    ],
    url
  );
  return res.json(new Payload(new Attachment([card])));
}

function getAllSquares(req, res) {
  // We cached the squares with their locations in the locationMapper before the server started.
  const squares = locationMapper.getSquares();
  const cards = [];

  const shuffledImagesArray = util.shuffleArray(images);

  let count = 1;
  let imageCount = 0;
  while (squares.length > 0) {
    // take 3 square objects
    const tripleSquares = squares.splice(0, 3);
    // construct a Card object with the 3 squares we just sampled
    const card = new Card(
      // sample a random image from the list.
      shuffledImagesArray[imageCount],
      `Pleinen ${count} - ${count + (tripleSquares.length - 1)}`,
      'Druk één van de pleinen om het programma te bekijken of om er naartoe te gaan',
      // create buttons from the 3 square objects, with a google maps link to their location.
      tripleSquares.map(square => new CardButton(square.name.nl, square.name.nl, 'postback'))
    );
    cards.push(card);
    count += 3;
    imageCount += 1;
  }
  return res.json(new Payload(new Attachment(cards)));
}

function getSquareCard(req, res) {
  const square = getSquareData(req.body.queryResult.parameters.square);
  getEventsNow().then((events) => {
    const squareName = square.name.nl.split('/')[0].toLowerCase();

    const eventNow = events.find((event) => {
      if (typeof event.address !== 'undefined' && event.address.toLowerCase().includes(squareName)) {
        return event;
      }
    });
    const url = `https://www.google.com/maps/search/?api=1&query=${square.lat},${square.long}`;
    // Om input van gebruker af te schermen wordt square.name.nl gebruikt ipv pleinName
    const imageName = square.name.nl.split('/')[0].trim().split(' ').join('_');
    const subtitle = eventNow ? `Nu: ${eventNow.eventName}` : 'Momenteel is er niets, voor meer info druk op programma';
    const card = new Card(
      `https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/pleinen/${imageName}.jpg`,
      square.name.nl,
      subtitle
      , [
        new CardButton('Programma', `Programma ${square.name.nl}`, 'postback'),
        new CardButton('Programma nu', 'Programma nu', 'postback'),
        generate_navigate_button(url)
      ]
    );
    return res.json(new Payload(new Attachment([card])));
  });
}

function getDaysGF(req, res) {
  const today = new Date().getDate;
  const startGf = new Date('2018-07-13');
  const endGf = new Date('2018-07-22');

  const gentseFeestenDays = [];

  // If today is during Gentsefeesten then return the remaining days else show all days
  const tmpDate = startGf < today && today <= endGf ? today : startGf;

  while (tmpDate <= endGf) {
    const date = `${new Date(tmpDate).getDate().toString()} Juli`;
    gentseFeestenDays.push(date);
    tmpDate.setDate(tmpDate.getDate() + 1);
  }
  console.log('I got here');
  const quickReply = new QuickReply('Voor welke datum wil je het programma zien?', gentseFeestenDays);
  console.log(JSON.stringify(new Payload(quickReply)));
  return res.json(new Payload(quickReply));
}

function getEventsGFNow(req, res) {
  getEventsNow().then((events) => {
    if (events.length === 0) {
      const defaultMenu = ['Feestpleinen', 'Toilet', 'Feedback'];
      const quickReply = new QuickReply('Er zijn op dit moment geen evenementen op de Gentse Feesten' +
                ', Hoe kan ik je verder helpen?', defaultMenu);
      return res.json(new Payload(quickReply));
    }

    // list to store all cards of events
    const cards = [];
    // console.log("list", events);

    events.forEach((event) => {
      // const square = locationMapper.getSquares().find(square => square.name.nl.toLowerCase() == event.address.toLowerCase());
      // construct a Card object for each event
      if (event.image_url == null) {
        event.image_url = 'https://www.uitinvlaanderen.be/sites/default/files/styles/large/public/beeld_gf_nieuwsbericht.jpg';
      }
      if (event.eventName.length > 64) {
        event.eventName = `${event.eventName.substr(0, 61)}...`;
      }
      if (typeof event.description === 'undefined') {
        event.description = '';
      }

      const imageUrlEncoded = encodeURI(event.image_url);
      const url = 'https://www.google.com/maps';
      const card = new Card(
        `${imageUrlEncoded}`,
        `${event.eventName} (${moment(event.startDate).add(2, 'hours').format('HH:mm')} - 
                    ${moment(event.endDate).add(2, 'hours').format('HH:mm')})`,
        `${event.description}`
        , [
          new Button('Toon mij de weg', url, 'web_url'),
          new CardButton('Terug naar hoofdmenu', 'menu', 'postback')
        ],
        'https://www.google.com/maps'
      );
      cards.push(card);
    });
    return res.json(new Payload(new Attachment(cards)));
  });
}

function getEventsNow() {
  // Use connect method to connect to the server
  return cosmosDB.getAllEventsFromNow().exec().then((events, err) => {
    if (err) {
      console.log(err);
    }
    return events;
  });
}

function getEvents(res, squareName, date = new Date()) {
  const square = getSquareData(squareName);

  // Use connect method to connect to the server
  cosmosDB.getEventsSelectedStageAndDate(new Date(date), squareName).exec((err, events) => {
    if (err) {
      return console.log('error', err);
    }

    if (events.length === 0) {
      const defaultMenu = ['Feestpleinen', 'Toilet', 'Feedback'];
      const quickReply = new QuickReply('Er zijn geen evenementen voor dit plein voor deze datum, Hoe kan ik je verder helpen?', defaultMenu);
      return res.json(new Payload(quickReply));
    }
    // list to store all cards of events
    const cards = [];

    // console.log("event 1:",events[0]);
    events.forEach((event) => {
      // const square = locationMapper.getSquares().find(square => square.name.nl.toLowerCase() == event.address.toLowerCase());
      // construct a Card object for each event
      const url = `https://www.google.com/maps/search/?api=1&query=${square.lat},${square.long}`;
      const imageUrlEncoded = encodeURI(event.image_url == null ? images[util.getRandomInt(0, images.length - 1)] : event.image_url);
      const card = new Card(
        `${imageUrlEncoded}`,
        `${event.eventName} (${moment(event.startDate).add(2, 'hours').format('H:mm')} - 
                ${moment(event.endDate).add(2, 'hours').format('H:mm')})`,
        `${event.description}`, [
          generate_navigate_button(url),
          new CardButton('Terug naar hoofdmenu', 'menu', 'postback')
        ],
        url
      );
      cards.push(card);
    });
    return res.json(new Payload(new Attachment(cards)));
  });
}

function getEventsSquareForDate(req, res) {
  return getEvents(res, req.body.queryResult.parameters.square, req.body.queryResult.parameters.date);
}

function getEventsForToday(req, res) {
  return getEvents(res, req.body.queryResult.parameters.square);
}

function getCurrentEventFor(req, res) {
  return getEvents(res, req.body.queryResult.parameters.square);
}

function getSquareData(squareName) {
  return locationMapper.getSquares().find(square => square.name.nl.split('/')[0].trim().toLowerCase() === squareName.toLowerCase());
}

module.exports = router;
