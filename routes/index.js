const router = require("express").Router();
const fetch = require("node-fetch");
const _ = require("../util/util");

/**
 *
 */
router.use("/", (req, res, next) => {
  fetch("https://visit.gent.be/en/lod/poi")
    .then(data => {
      return data.json();
    })
    .then(json => {
      json = _.combineUrls(json);
      return res.json(json);
    })
    .catch(next);
});

exports = module.exports = router;
