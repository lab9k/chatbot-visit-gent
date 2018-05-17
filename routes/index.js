const router = require("express").Router();
const _ = require("../util/util");

const langMiddleware = (req, res, next) => {
  let lang = req.query.lang;
  switch (lang) {
    case "Nederlands":
      req.loc = "nl";
      break;
    case "English":
      req.loc = "en";
      break;
    case "Français":
      req.loc = "fr";
      break;
    case "Deutsch":
      req.loc = "de";
      break;
    case "Español":
      req.loc = "es";
      break;
  }
  next();
};

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

router.get("/places", langMiddleware, (req, res, next) => {
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
