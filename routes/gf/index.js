const router = require('express').Router();
const _ = require('../../util/util');
// const mw = require('../../util/middleware');
// const jsonld = require('jsonld');

router.get('/locaties', (/* req, */ res /* next */) => {
  const url =
    'https://datatank.stad.gent/4/cultuursportvrijetijd/gentsefeestenlocaties.json';
  _.fetch(url)
    .then((data) => data.json())
    .then((json) => {
      const data = json.filter((el) => el.containedInPlace === null);
      return res.json(data);
    });
});

module.exports = router;
