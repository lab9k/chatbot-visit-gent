const router = require("express").Router();
const _ = require("../util/util");

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
      messages: [
        {
          text: "",
          quick_replies: []
        }
      ]
    };
    response.messages[0].text = req.t("poi_find");
    let message = response.messages[0];
    json.forEach(poi => {
      let btn = {
        title: poi.name[req.loc][0],
        type: "show_block",
        block_names: ["GET_POIdescription"],
        set_attributes: {
          POI: poi["@id"]
        }
      };
      message.quick_replies.push(btn);
    });
    res.json(response);
  });
});

exports = module.exports = router;
