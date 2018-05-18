const idMiddleWare = (req, res, next) => {
  if (!req.query.id) return res.json({ error: "id url was not specified" });
  req.poi_id = req.query.id;
  next();
};

const langMiddleWare = (req, res, next) => {
  const message = req.body.incoming_message;
  if (!message) return res.json({ error: "something went wrong" });
  switch (message.toLowerCase()) {
    case "nederlands":
      req.loc = "nl";
      break;
    case "english":
      req.loc = "en";
      break;
    case "français" || "francais":
      req.loc = "fr";
      break;
    case "deutsch":
      req.loc = "de";
      break;
    case "español" || "espanol":
      req.loc = "es";
      break;
    default:
      req.loc = "en";
      req.error = "Language was not found, defaulting to English";
      break;
  }
  next();
};

exports = module.exports = {
  idMiddleWare,
  langMiddleWare
};
