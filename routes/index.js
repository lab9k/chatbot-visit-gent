const router = require("express").Router();
const _ = require("../util/util");

const langMiddleware = (req, res, next) => {
  let lang = req.query.lang;
  switch (lang) {
    case "Nederlands":
      lang = "nl";
      break;
    case "English":
      lang = "en";
      break;
    case "Français":
      lang = "fr";
      break;
    case "Deutsch":
      lang = "de";
      break;
    case "Español":
      lang = "es";
      break;
  }
  req.lang = lang;
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
      messages: [{ text: "Welcome to the Chatfuel Rockets!" }]
    };
    return res.json(response);
  });
});

exports = module.exports = router;
