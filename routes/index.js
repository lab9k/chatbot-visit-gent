const router = require('express').Router();
const _ = require('../util/util');
const mw = require('../util/middleware');

router.get('/', (req, res, next) => {
  _.fetchPointsOfInterest()
    .then((json) => {
      json = _.combineUrls(json);
      json = json.map((el) => {
        return _.filterProperties(el);
      });
      return res.json(json);
    })
    .catch(next);
});

router.get('/places', (req, res, next) => {
  if (!req.loc) {
    req.loc = 'en';
  }
  _.fetchPointsOfInterest().then((json) => {
    json = _.combineUrls(json);
    json = json.map((el) => {
      return _.filterProperties(el);
    });
    let response = {
      messages: [
        {
          text: '',
          quick_replies: [],
        },
      ],
    };
    response.messages[0].text = req.t('poi_find');
    let message = response.messages[0];
    json.forEach((poi) => {
      let btn = {
        title: poi.name[req.loc][0],
        type: 'show_block',
        block_names: ['GET_POIdescription'],
        set_attributes: {
          POI: poi['@id'],
        },
      };
      message.quick_replies.push(btn);
    });
    res.json(response);
  });
});
router.post('/places', (req, res, next) => {
  let response = {
    user_id: req.body.user_id,
    bot_id: req.body.bot_id,
    module_id: req.body.module_id,
    message: JSON.stringify(req.body),
  };
  res.json(response);
});
router.get('/description', mw.idMiddleWare, (req, res, next) => {
  if (!req.loc) {
    req.loc = 'en';
  }
  _.fetchPointsOfInterest().then((json) => {
    json = _.combineUrls(json);
    json = json.map((el) => {
      return _.filterProperties(el);
    });
    json = json.filter((poi) => {
      return poi['@id'] === req.poi_id;
    });
    const poi = json[0];
    const { description, mainEntityOfPage } = poi;
    let body = '';
    if (
      mainEntityOfPage.hasPart &&
      mainEntityOfPage.hasPart.length > 0 &&
      mainEntityOfPage.hasPart[0].articleBody &&
      mainEntityOfPage.hasPart[0].articleBody[req.loc] &&
      mainEntityOfPage.hasPart[0].articleBody[req.loc].length > 0
    ) {
      body = mainEntityOfPage.hasPart[0].articleBody[req.loc][0];
    }

    let response = {
      messages: [
        {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              image_aspect_ratio: 'square',
              elements: [
                {
                  title: poi.name[req.loc][0],
                  image_url:
                    poi.image[Math.floor(Math.random() * poi.image.length)].url,
                  subtitle: description[req.loc][0],
                },
              ],
            },
          },
        },
        { text: body },
      ],
    };

    return res.json(response);
  });
});

exports = module.exports = router;
