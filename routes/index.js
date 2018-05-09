const router = require("express").Router();
const fetch = require("node-fetch");

router.use("/", (req, res, next) => {
  fetch(
    "https://datatank.stad.gent/4/cultuursportvrijetijd/gentsefeestenlocaties.json"
  )
    .then(data => {
      return data.json();
    })
    .then(json => {
      json = [json[0]];
      json = json.map(el => {
        let { name, address, outDoors } = el;
        return { name, address, outDoors };
      });
      return res.json(json);
    })
    .catch(next);
});

exports = module.exports = router;
