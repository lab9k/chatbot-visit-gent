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

const t = {
  messages: [
    {
      text: "",
      quick_replies: [
        // {
        //   set_attributes: {
        //     "some attribute": "some value",
        //     "another attribute": "another value"
        //   },
        //   block_names: ["Block 1"],
        //   type: "show_block",
        //   title: "Go!"
        // },
        // {
        //   set_attributes: {
        //     "some attribute": "some value",
        //     "another attribute": "another value"
        //   },
        //   block_names: ["Block 1"],
        //   type: "show_block",
        //   title: "Go!"
        // }
      ]
    }
  ]
};

router.get("/places", (req, res, next) => {
  _.fetchPointsOfInterest().then(json => {
    json = _.combineUrls(json);
    json = json.map(el => {
      return _.filterProperties(el);
    });
    let response = {};
    Object.assign(response, t);
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
      if (!message.quick_replies) {
        message.quick_replies = [];
      }
      message.quick_replies.push(btn);
    });
    res.json(response);
  });
});

exports = module.exports = router;
