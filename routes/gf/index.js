const router = require('express').Router();
const mw = require('../../util/middleware');
const Card = require('../../models/card');
const Button = require('../../models/button');
const CardButton = require('../../models/card_button');
const QuickReply = require('../../models/quickReply')
// const _ = require('../../util/util');
const LocationMapper = require('../../util/locationmapper');
const loc = require('../../util/location');
const EventMapper = require('../../util/eventmapper');
const eventMapper = new EventMapper();
const locationMapper = new LocationMapper();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// environment variables for connection with DB
require('dotenv').config()


const pg = require('knex')({
  client: 'pg',
  connection: process.env.CONNECTION_STRING,
  searchPath: ['knex', 'public']
});

router.all('/', mw.typeMiddleware, (req, res, next) => {
  let fn;
  switch (req.type) {
    case 'get_plein_location':
      fn = handleLocation;
      break;
    case 'events':
      fn = handleEvents;
      break;
    case 'all_squares':
      fn = allSquares;
      break;
    case 'toiletten.search':
      fn = searchToiletten;
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
      fn = getDays;
      break;
    default:
      return next(new Error(`type not defined: ${req.type}, action: ${req.body.queryResult.action}`));
  }
  return fn(req, res, next);
});

const handleLocation = (req, res /* , next */) => {
  const original = req.body.originalDetectIntentRequest;
  const { payload } = original;
  const { lat, long } = payload.data.postback.data;
  const squares = locationMapper.getSquares();
  // log all squares
  // squares.filter(square => console.log(square.address)); 
  const nearest = loc.closestLocation({ lat, long }, squares);

  urlName = nearest.name.nl.replace(" ", "_")
  console.log(`https://github.com/lab9k/chatbot-visit-gent/blob/master/img/pleinen/${urlName}.jpg`)

  const card = new Card(
    `https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/pleinen/${urlName}.jpg`,
    `${nearest.name.nl}`,
    [long, lat],
    { subtitle: `${nearest.display_name}` },
    [
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

const checkConnectionAndTable = () => {
  console.log(process.env.CONNECTION_STRING);

  if (process.env.CONNECTION_STRING) {
    pg.schema.hasTable('feedback').then((exists) => {
      console.log('feedbackTableExists', exists);
      if (!exists) {
        console.log('creating table...');
        pg.schema
          .createTable('feedback', (table) => {
            table.increments();
            table.text('body', 'longtext');
            table.string('created_at');
          })
          .then(() => {
            console.log('feedback table succesfully created!');
          });
      } else {
        console.log('table feedback already exists');
      }
    });
  } else {
    console.log('no connection with pg');
  }
};
checkConnectionAndTable();

const handleEvents = (req, res, next ) => {
  // Use connect method to connect to the server

  console.log("event action triggered")
  /* MongoClient.connect(process.env.COSMOS_DB_URL, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    
  
    const db = client.db(process.env.COSMOS_DB_NAME);
    client.close();
  }); */

};

const searchToiletten = (req, res) => {
  const original = req.body.originalDetectIntentRequest;
  const { payload } = original;
  const { lat, long } = payload.data.postback.data;
  const toiletten = locationMapper.getToilets();
  const nearest = loc.closestLocation({ lat, long }, toiletten);

  const card = new Card(
    'https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/toilet/toilet.jpg',
    'Dichtstbijzijnde toilet',
    [long, lat],
    { subtitle: 'Klik op navigeer om naar het dichtsbijzijnde toilet te navigeren' },
    [
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

  //const quickReply = new QuickReply();

  //console.log(quickReply.getResponse())

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

const feedbackSatisfaction = (req, res, next) => {
  console.log('feedback satisfaction triggered');
  checkConnectionAndTable();
};

const feedbackImprovement = (req, res, next) => {
  console.log('feedback improvement triggered');
  const getTimezoneDate = () => {
    const date = new Date();
    const hours = date.getHours() + 2;
    const minutes = date.getMinutes();
    const miliseconds = date.getMilliseconds();
    const fullDateString = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${hours}:${minutes}:${miliseconds}`;
    console.log(fullDateString);
    return fullDateString;
  };
  pg
    .insert({
      body: req.body.queryResult.parameters.improvement_proposal,
      created_at: getTimezoneDate()
    })
    .into('feedback')
    .then(() => {
      console.log('feedback data insterted!');
      pg
        .select()
        .table('feedback')
        .then((results) => {
          console.log(results);
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {
      console.log(e);
    });
};

const allSquares = (req, res) => {
  // We cached the squares with their locations in the locationMapper before the server started.
  const squares = locationMapper.getSquares();
  const elements = [];
  // Some sample images to be used in the cards.
  const images = [
    'http://focusonbelgium.be/sites/default/files/styles/big_article_image/public/events/gentse_feesten_avond_c_stad_gent.jpg?itok=5VUGrS2o',
    'https://nbocdn.akamaized.net/Assets/Images_Upload/2017/07/14/ID-FVV_547c2b8ecf0a6535d0bca19654735180_201707136.jpg?maxheight=460&maxwidth=638',
    'https://dekuipe.files.wordpress.com/2013/05/gentfotos3-008.jpg',
    'https://www.belg.be/wp-content/uploads/2016/07/foto-stad-gent-gentse-feesten.jpg',
    'http://i46.tinypic.com/2cf5eo2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Gentse_Belleman_2008.jpg/266px-Gentse_Belleman_2008.jpg',
    'https://www.centrumvooravondonderwijs.be/wp-content/uploads/2013/01/Campussen_Gent_CVA.jpg',
    'http://www.dewarande.be/sites/default/files/gent2.jpg',
    'http://www.tvosken.be/wp-content/uploads/2014/08/gent_snachts.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Ghent_-_centre.jpg/1200px-Ghent_-_centre.jpg'
  ];
  let count = 1;
  while (squares.length > 0) {
    // take 3 square objects
    const three = squares.splice(0, 3);
    // construct a Card object with the 3 squares we just sampled
    const card = new Card(
      // sample a random image from the list.
      images.splice(Math.floor(Math.random() * images.length), 1)[0],
      'Pleinen',
      [0, 3],
      { subtitle: 'Klik op één van de pleinen om het programma te bekijken of om te navigeren' },
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

const getPleinCard = (req, res /* , next */) => {
  const pleinName = req.body.queryResult.parameters.plein;
  const square = locationMapper.getSquares().find(square => square.name.nl.toLowerCase() == pleinName.toLowerCase());
  //console.log("get plein card test. prop: ", square, " value ", square.lat);
  const lat = square.lat;
  const long = square.long;
  //log all squares
  //squares.filter(square => console.log(square.address));
  
  //const nearest = loc.closestLocation({ lat, long }, squares);
  const imageName = square.name.nl.replace(" ", "_");

  const card = new Card(
    `https://raw.githubusercontent.com/lab9k/chatbot-visit-gent/master/img/pleinen/${imageName}.jpg`,
    `${square.name.nl}`,
    [long, lat],
    { subtitle: `${square.display_name}` },
    [
      new Button(
        'Navigeer', 
        `https://www.google.com/maps/search/?api=1&query=${square.lat},${square.long}`, 
        'web_url'
      ),
      new CardButton(
        `Programma ${square.name.nl}`,
        `Programma ${square.name.nl}`,
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


const getDays = (req, res /* , next */) => {
  console.log("test");
  const today = new Date().getDate;  
  const startGf = new Date("2018-07-13");
  const endGf = new Date("2018-07-22");

  const gentseFeestenDays = [];
  
  // If today is during Gentsefeesten then return the remaining days else show all days
  let tmpDate = startGf < today && today <= endGf ? today : startGf;
  
  while (tmpDate <= endGf) {
    const date = new Date(tmpDate).getDate().toString() +" Juli";
    gentseFeestenDays.push(date);
    tmpDate.setDate(tmpDate.getDate() + 1);
  }

  const quickReply = new QuickReply("Voor welke datum wilt je het programma zien?", gentseFeestenDays).getResponse();

  console.log("quickReply ", quickReply);//, " days ", gentseFeestenDays);

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
  const { events } = eventMapper;
  const ret = [];
  events.forEach((ev) => {
    const included = ret.findIndex(el => el.name.nl === ev.name.nl);
    if (included === -1) {
      return ret.push({ ...ev, startDates: [ev.startDate] });
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
