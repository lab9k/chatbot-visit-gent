const router = require("express").Router();
const fetch = require("node-fetch");

router.use("/", (req, res, next) => {
  const nonverbose = req.query["v"];
  fetch(
    "https://datatank.stad.gent/4/cultuursportvrijetijd/gentsefeestenlocaties.json"
  )
    .then(data => {
      return data.json();
    })
    .then(json => {
      if (nonverbose) {
        json = json.map(el => {
          delete el["@context"];
          return el;
        });
      }
      return res.json(json);
    })
    .catch(next);
});

exports = module.exports = router;
