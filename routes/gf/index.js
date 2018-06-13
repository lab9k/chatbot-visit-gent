const router = require('express').Router();
const mw = require('../../util/middleware');
const Card = require('../../models/card');
const Button = require('../../models/button');
// const _ = require('../../util/util');
const LocationMapper = require('../../util/locationmapper');

const locationMapper = new LocationMapper();

// const _ = require('../../util/util');
// const locApi = require('../../util/location');
// const mw = require('../../util/middleware');
// const jsonld = require('jsonld');
// address: 135+pilkington+avenue,+birmingham

// const coordsApiUrl = (address, format = 'json') =>
//   `https://nominatim.openstreetmap.org/search?q=${address}&format=${format}&polygon=1&addressdetails=1`;
// const distanceApiUrl = (currentLoc, searchingLoc) =>
//   `http://router.project-osrm.org/route/v1/driving/${currentLoc.lon},${
//     currentLoc.lat
//   };${searchingLoc.lon},${searchingLoc.lat}?overview=false`;

// router.all('/locaties', (req, res, next) => {
//   const { location } = req;
//   if (location.type !== 'coords') {
//     _.fetch(coordsApiUrl(location.value))
//       .then((data) => data.json())
//       .then((coordsData) => {
//         // use coordsData to find all places closer than 'radius'
//         // TODO: parse location data;
//         const locationsGentUrl =
//           'https://datatank.stad.gent/4/cultuursportvrijetijd/gentsefeestenlocaties.json';
//         _.fetch(locationsGentUrl)
//           .then((data) => data.json())
//           .then((locations) => {
//             const checking = locations.filter((el) => _.isSquare(el));
//             const promises = [];
//             checking.forEach((loc) => {
//               // TODO: parse loc location data
//               const p = _
//                 .fetch(distanceApiUrl(coordsData, loc))
//                 .then((data) => data.json());
//               promises.push(p);
//             });
//             promises.all((values) => {
//               const ret = checking.filter((el, index) => {
//                 // TODO: parse values to find distances
//                 return values[index] > req.radius;
//               });
//               return res.json(ret);
//             });
//           });
//       })
//       .catch((err) => next(err));
//   }
// });

// router.all('/events', (req, res, next) => {
//   const url = 'https://datatank.stad.gent/4/toerisme/gentsefeestenevents.json';
//   _.fetch(url)
//     .then((data) => data.json())
//     .then((json) => res.json(json.slice(0, 10)))
//     .catch((err) => next(err));
// });

router.all('/', mw.typeMiddleware, (req, res, next) => {
  let fn;
  switch (req.type) {
    case 'location':
      fn = handleLocation;
      break;
    case 'events':
      fn = handleEvents;
      break;
    case 'all_squares':
      fn = allSquares;
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
  const card = new Card(
    'http://www.martinvrijland.nl/archief/wp-content/uploads/2015/01/charliehebdo_large-200x200.png',
    'testing',
    [long, lat],
    { subtitle: 'testSub' },
    [new Button('btnTest', 'https://google.be', 'web_url')]
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
  console.log(JSON.stringify({ body: req.body, returnValue: ret }));
  return res.json(ret);
};
const handleEvents = (/* req, res  , next */) => { };

const allSquares = (req, res) => {
  const squares = locationMapper.getSquares();
  const elements = [];
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
    const three = squares.splice(0, 3);
    const card = new Card(
      images.splice(Math.floor(Math.random() * images.length), 1)[0],
      'pleinen',
      [0, 3],
      { subtitle: `plein ${count} - ${count + 2}` },
      three.map((el) => new Button(
        el.name.nl,
        `https://www.google.com/maps/search/?api=1&query=${el.lat},${el.long}`,
        'web_url'
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
            elements: elements.map((el) => el.getResponse())
          }
        }
      }
    }
  };
  console.log(JSON.stringify({ type: 'all_squares', body: req.body, returnValue: payload }));
  return res.json(payload);
};

module.exports = router;
