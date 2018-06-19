const router = require('express').Router();
const uuidV1 = require('uuid/v1');
const mw = require('../../util/middleware');
const Card = require('../../models/card');
const Button = require('../../models/button');
const CardButton = require('../../models/card_button');
// const _ = require('../../util/util');
const LocationMapper = require('../../util/locationmapper');
const loc = require('../../util/location');
const EventMapper = require('../../util/eventmapper');

const eventMapper = new EventMapper();
const locationMapper = new LocationMapper();

const pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: ['knex', 'public'],
});

router.get('/allData', (req, res) => res.json({ locaties: locationMapper.getSquares() }));
router.get('/test', (req, res) => res.json({'test':'test'}));
router.get('/feedback', (req, res) => {
  console.log('getting all feedback...');
  pg
    .select()
    .table('feedback')
    .then((results) => {
      console.log('success get all feedback');
      res.json(results);
    })
    .catch((e) => {
      console.log(e);
    })
})
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
  
  //log all squares
  //squares.filter(square => console.log(square.address));
  
  const nearest = loc.closestLocation({ lat, long }, squares);

  const card = new Card(
    'http://www.martinvrijland.nl/archief/wp-content/uploads/2015/01/charliehebdo_large-200x200.png',
    `${nearest.name.nl}`,
    [long, lat],
    { subtitle: `${nearest.display_name}` },
    [new Button('btnTest', 'https://google.be', 'web_url')]
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
  console.log('Connection string', process.env.DATABASE_URL);

  if (process.env.DATABASE_URL) {
    pg.schema.hasTable('feedback').then((exists) => {
      console.log('feedbackTableExists', exists);
      if (!exists) {
        console.log('creating table...');
        pg.schema
          .createTable('feedback', (table) => {
            table.increments();
            table.uuid('uuid');
            table.string('body', 'longtext');
            table.timestamps(true, false);
          })
          .then(() => {
            console.log('feedback table succesfully created!');
          })
      } else {
        console.log('table feedback already exists');
      }
    });
  } else {
    console.log('no connection with pg')
  }
};
const handleEvents = (/* req, res  , next */) => {
  //sort programma by location
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

const feedbackSatisfaction = (req, res, next) => {
  console.log('feedback satisfaction triggered');
  checkConnectionAndTable();
}

const feedbackImprovement = (req, res, next) => {
  console.log('feedback improvement triggered');
  console.log(req.body.queryResult.parameters.improvement_proposal);
  pg
    .insert({
      uuid: uuidV1(),
      body: req.body.queryResult.parameters.improvement_proposal
    })
    .into('feedback')
    .then(() => {
      console.log('feedback data insterted!');
    })
    .catch((e) => {
      console.log(e);
    })
}

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
      { subtitle: `Klik op één van de pleinen om het programma te bekijken of om te navigeren` },
      // create buttons from the 3 square objects, with a google maps link to their location.
      three.map(el =>
        new CardButton(
          el.name.nl,
          el.name.nl,
          'postback'    
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
