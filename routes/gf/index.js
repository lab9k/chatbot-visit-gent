const router = require('express').Router();
const _ = require('../../util/util');
// const locApi = require('../../util/location');
// const mw = require('../../util/middleware');
// const jsonld = require('jsonld');
// address: 135+pilkington+avenue,+birmingham
const coordsApiUrl = (address, format = 'json') =>
  `https://nominatim.openstreetmap.org/search?q=${address}&format=${format}&polygon=1&addressdetails=1`;
const distanceApiUrl = (currentLoc, searchingLoc) =>
  `http://router.project-osrm.org/route/v1/driving/${currentLoc.lon},${
    currentLoc.lat
  };${searchingLoc.lon},${searchingLoc.lat}?overview=false`;

router.all('/locaties', (req, res, next) => {
  const { location } = req;
  if (location.type !== 'coords') {
    _.fetch(coordsApiUrl(location.value))
      .then((data) => data.json())
      .then((coordsData) => {
        // use coordsData to find all places closer than 'radius'
        // TODO: parse location data;
        const locationsGentUrl =
          'https://datatank.stad.gent/4/cultuursportvrijetijd/gentsefeestenlocaties.json';
        _.fetch(locationsGentUrl)
          .then((data) => data.json())
          .then((locations) => {
            const checking = locations.filter((el) => _.isSquare(el));
            const promises = [];
            checking.forEach((loc) => {
              // TODO: parse loc location data
              const p = _
                .fetch(distanceApiUrl(coordsData, loc))
                .then((data) => data.json());
              promises.push(p);
            });
            promises.all((values) => {
              const ret = checking.filter((el, index) => {
                // TODO: parse values to find distances
                return values[index] > req.radius;
              });
              return res.json(ret);
            });
          });
      })
      .catch((err) => next(err));
  }
});

router.all('/events', (req, res, next) => {
  const url = 'https://datatank.stad.gent/4/toerisme/gentsefeestenevents.json';
  _.fetch(url)
    .then((data) => data.json())
    .then((json) => res.json(json.slice(0, 10)))
    .catch((err) => next(err));
});

router.all('/', (req, res, next) => {
  return res.json(req.body);
});

module.exports = router;
