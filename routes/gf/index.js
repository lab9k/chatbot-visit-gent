const router = require('express').Router();
const mw = require('../../util/middleware');
const Card = require('../../models/card');
const Button = require('../../models/button');
const _ = require('../../util/util');

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

const allSquares = (req, res, next) => {
  _.fetch('https://datatank.stad.gent/4/cultuursportvrijetijd/gentsefeestenlocaties.json')
    .then((data) => data.json())
    .then((locations) => {
      const squares = locations.filter((el) => _.isSquare(el));
      const elements = [];
      while (squares.length > 0) {
        const three = squares.splice(0, 4);
        const card = new Card(
          'https://visit.gent.be/sites/default/files/img/article/hero/Gent_Graslei_zonsondergang.JPG',
          'pleinen',
          [0, 3],
          { subtitle: 'subtitle' },
          three.map((el) => new Button(el.name.nl, 'https://www.google.be', 'web_url'))
        );
        elements.push(card);
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
    }).catch((err) => next(err));
};

module.exports = router;
