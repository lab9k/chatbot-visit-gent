const router = require("express").Router();
const _ = require("../util/util");

/**
 *
 */
router.get("/", (req, res, next) => {
  _.fetchPointsOfInterest()
    .then(json => {
      json = _.combineUrls(json);
      json = json.map(el => {
        return _.filterProperties(el);
      });
      return res.json(json);
    })
    .catch(next);
});

router.get("/places", (req, res, next) => {
  _.fetchPointsOfInterest().then(json => {
    json = _.combineUrls(json);
    json = json.map(el => {
      return _.filterProperties(el);
    });
    let response = {
      messages: [{ text: req.t("test") }],
      locale: req.loc
    };
    return res.json(response);
  });
});

exports = module.exports = router;
