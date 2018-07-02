//Router for API
const router = require('express').Router();
const mw = require('../../util/middleware');

//Models for messenger
const Card = require('../../models/card');
const Button = require('../../models/button');
const CardButton = require('../../models/card_button');
const QuickReply = require('../../models/quickReply');
const ShareButton = require('../../models/share_button');

//Location mappers
const LocationMapper = require('../../util/locationmapper');
const loc = require('../../util/location');
const EventMapper = require('../../util/eventmapper');
const eventMapper = new EventMapper();
const locationMapper = new LocationMapper();

//Database managers
const cosmosDB = require("../../db/cosmosDB/cosmosDBManager");
const postgresqlManager = require("../../db/postgresql/postgresqlManager");

//Date conversions
const moment = require('moment');

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
    case 'feedback.improvement':
      fn = feedbackImprovement;
      break;
    case 'plein_card':
      fn = getPleinCard;
      break;
    case 'get_days':
      fn = getDaysGentseFeesten;
      break;
    default:
      return next(new Error(`type not defined: ${req.type}, action: ${req.body.queryResult.action}`));
  }
  return fn(req, res, next);
});


const feedbackSatisfaction = (req, res, next) => {
  console.log('feedback satisfaction triggered');
  postgresqlManager.checkConnectionAndTable();
};

const feedbackImprovement = (req, res, next) => {
  postgresqlManager.addFeedbackImprovement(req.body.queryResult.parameters.improvement_proposal)
};

const getClosestStage = (req, res /* , next */ ) => {
  const original = req.body.originalDetectIntentRequest;
  const {
    payload
  } = original;
  const {
    lat,
    long
  } = payload.data.postback.data;
  const squares = locationMapper.getSquares();
  const nearest = loc.closestLocation({
    lat,
    long
  }, squares);

  urlName = nearest.name.nl.split(' ').join('_')

  const card = new Card(
    `https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/pleinen/${urlName}.jpg`,
    `${nearest.name.nl}`, [long, lat], {
      subtitle: "Klik op één van de volgende knoppen om te navigeren of het programma te bekijken."
    }, [
      new Button(
        'Navigeer',
        `https://www.google.com/maps/dir/?api=1&origin=${lat},${long}&destination=${nearest.lat},${
          nearest.long
        }&travelmode=walking`,
        'web_url'
      ),
      new CardButton(
        `Programma ${nearest.name.nl}`,
        `Programma ${nearest.name.nl}`,
        "postback"
      ),
      new CardButton(
        "Terug naar hoofdmenu",
        "menu",
        "postback"
      )
    ]
  );
  const ret = {
    payload: {
      facebook: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [card.getResponse()]
          }
        }
      }
    }
  };
  return res.json(ret);
};

const getEventsSquareForDate = (req, res) => {
  const date = req.body.queryResult.parameters.date;
  console.log(date)
  // Use connect method to connect to the server
  const query = cosmosDB.getEventsSelectedStageAndDate(new Date(date), "Korenmarkt")

  query.exec(function (err, events) {
    if (err)
      return console.log(err);
      //list to store all cards of events
      let cardList = [];
      
      //console.log(events)
      events.forEach((event) => {
          //const square = locationMapper.getSquares().find(square => square.name.nl.toLowerCase() == event.address.toLowerCase());
          // construct a Card object for each event
          if(event.image_url == null) {
            event.image_url = "https://www.uitinvlaanderen.be/sites/default/files/styles/large/public/beeld_gf_nieuwsbericht.jpg"
          }

          const card = new Card(
            `${event.image_url}`,
            `${event.name} (${moment(event.startDate).format('H:mm')} - ${moment(event.endDate).format('H:mm')})`, [0,3], {
              subtitle: `${event.description}`
            }, [
              new Button(
                'Navigeer',
                `google.com`,
                'web_url'
              ),
              new CardButton(
                "Terug naar hoofdmenu",
                "menu",
                "postback"
              )
            ],
          );
          cardList.push(card); 
      })

      const payload = {
        payload: {
          facebook: {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'generic',
                // get the json structure for the card
                elements: cardList.map(el => el.getResponse())
              }
            }
          }
        }
      };
      return res.json(payload);
  });
};

const getClosestToilet = (req, res) => {
  const original = req.body.originalDetectIntentRequest;
  const {
    payload
  } = original;
  const {
    lat,
    long
  } = payload.data.postback.data;
  const toiletten = locationMapper.getToilets();
  const nearest = loc.closestLocation({
    lat,
    long
  }, toiletten);

  const card = new Card(
    'https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/toilet/toilet.jpg',
    'Dichtstbijzijnde toilet', [long, lat], {
      subtitle: 'Klik op navigeer om naar het dichtsbijzijnde toilet te navigeren'
    }, [
      new Button(
        'Navigeer',
        `https://www.google.com/maps/dir/?api=1&origin=${lat},${long}&destination=${nearest.lat},${
          nearest.long
        }&travelmode=walking`,
        'web_url'
      ),
      new CardButton(
        "Terug naar hoofdmenu",
        "menu",
        "postback"
      )
    ],

  );

  const ret = {
    payload: {
      facebook: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              card.getResponse()
            ]
          }
        }
      }
    }
  };

  return res.json(ret);
};

const getAllSquares = (req, res) => {
  // We cached the squares with their locations in the locationMapper before the server started.
  const squares = locationMapper.getSquares();
  const elements = [];

  let count = 1;
  while (squares.length > 0) {
    // take 3 square objects
    const three = squares.splice(0, 3);
    // construct a Card object with the 3 squares we just sampled
    const card = new Card(
      // sample a random image from the list.
      "https://www.uitinvlaanderen.be/sites/default/files/styles/large/public/beeld_gf_nieuwsbericht.jpg",
      `Pleinen ${count} - ${count + (three.length -1)}`, [0, 3], {
        subtitle: 'Klik op één van de pleinen om het programma te bekijken of om te navigeren'
      },
      // create buttons from the 3 square objects, with a google maps link to their location.
      three.map(el =>
        new CardButton(
          el.name.nl,
          el.name.nl,
          "postback"
        ))
    );
    elements.push(card);
    count += 3;
  }
  const payload = {
    payload: {
      facebook: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            // get the json structure for the card
            elements: elements.map(el => el.getResponse())
          }
        }
      }
    }
  };
  return res.json(payload);
};

const getPleinCard = (req, res /* , next */ ) => {
  const pleinName = req.body.queryResult.parameters.plein;

  const square = locationMapper.getSquares().find(square => square.name.nl.split('/')[0].trim().toLowerCase() == pleinName.toLowerCase());

  const lat = square.lat;
  const long = square.long;

  //Om input van gebruker af te schermen wordt square.name.nl gebruikt ipv pleinName
  const imageName = square.name.nl.split('/')[0].trim().split(' ').join('_');  

  const navigeergButton = new Button(
    'Navigeer',
    `https://www.google.com/maps/search/?api=1&query=${square.lat},${square.long}`,
    'web_url'
  ) ;

  const card = new Card(
    `https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/pleinen/${imageName}.jpg`,
    square.name.nl, [long, lat], {
      subtitle: `Klik op één van de volgende knoppen om te navigeren of het programma te bekijken.`
    }, [
      navigeergButton,
      new CardButton(
        `Programma ${square.name.nl}`,
        `Programma ${square.name.nl}`,
        "postback"
      ),/*
      new ShareButton(
        square.name.nl,
        `https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/pleinen/${imageName}.jpg`,      
        [navigeergButton],
      ),*/
      new CardButton(
        "Terug naar hoofdmenu",
        "menu",
        "postback"
      )
    ]
  );
  const ret = {
    payload: {
      facebook: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [card.getResponse()]
          }
        }
      }
    }
  };

  console.log("ret json", ret);
  return res.json(ret);
};


const getDaysGentseFeesten = (req, res /* , next */ ) => {
  const today = new Date().getDate;
  const startGf = new Date("2018-07-13");
  const endGf = new Date("2018-07-22");

  const gentseFeestenDays = [];

  // If today is during Gentsefeesten then return the remaining days else show all days
  let tmpDate = startGf < today && today <= endGf ? today : startGf;

  while (tmpDate <= endGf) {
    const date = new Date(tmpDate).getDate().toString() + " Juli";
    gentseFeestenDays.push(date);
    tmpDate.setDate(tmpDate.getDate() + 1);
  }

  const quickReply = new QuickReply("Voor welke datum wilt je het programma zien?", gentseFeestenDays).getResponse();

  const ret = {
    payload: {
      facebook: {
        "text": quickReply.text,
        "quick_replies": quickReply.quick_replies
      }
    }
  };

  return res.json(ret);
}

router.get('/debug', (req, res) => {
  const {
    events
  } = eventMapper;
  const ret = [];
  events.forEach((ev) => {
    const included = ret.findIndex(el => el.name.nl === ev.name.nl);
    if (included === -1) {
      return ret.push({ ...ev,
        startDates: [ev.startDate]
      });
    }
    if (!ret[included].startDates) {
      ret[included].startDates = [];
    }
    return ret[included].startDates.push(ev.startDate);
  });
  res.json({
    count: ret.length,
    items: ret.map(el => ({
      name: el.name.nl,
      startDates: el.startDates,
      location: el.location
    }))
  });
});

module.exports = router;