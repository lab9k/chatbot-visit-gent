const router = require('express').Router();
const _ = require('../../util/util');
// const mw = require('../../util/middleware');
// const jsonld = require('jsonld');

router.all('/locaties', (req, res, next) => {
  const url =
    'https://datatank.stad.gent/4/cultuursportvrijetijd/gentsefeestenlocaties.json';
  _.fetch(url)
    .then((data) => data.json())
    .then((json) => {
      const squares = json.filter((el) => _.isSquare(el));
      return res.json({ length: squares.length, squares });
    })
    .catch((err) => next(err));
});

router.all('/events', (req, res, next) => {
  const url = 'https://datatank.stad.gent/4/toerisme/gentsefeestenevents.json';
  _.fetch(url)
    .then((data) => data.json())
    .then((json) => res.json(json.slice(0, 10)))
    .catch((err) => next(err));
});

module.exports = router;
