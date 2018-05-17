const router = require("express").Router();
const fetch = require("node-fetch");

/**
 *
 */
router.use("/", (req, res, next) => {
  fetch("https://visit.gent.be/en/lod/poi")
    .then(data => {
      return data.json();
    })
    .then(json => {
      json = combineUrls(json);
      return res.json(json);
    })
    .catch(next);
});

const combineUrls = json => {
  let combinedLang = [];
  json.forEach(el => {
    let exists = combinedLang.find(i => {
      return i["@id"] === el["@id"];
    });
    if (exists) {
      let lang = findLang(el.url);
      exists.url[lang] = [el["url"]];
    } else {
      let lang = findLang(el["url"]);
      let urlField = {};
      urlField[lang] = [el["url"]];
      let newEl = Object.assign({}, el);
      newEl.url = urlField;
      combinedLang.push(newEl);
    }
  });
  return combinedLang;
};

const findLang = url => {
  let pattern = /visit.gent.be\/([a-z]{2})\//g;
  let match = pattern.exec(url);
  return match[1];
};

exports = module.exports = router;
