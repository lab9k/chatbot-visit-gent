const langMiddleware = (req, res, next) => {
  let lang = req.query.lang;
  if (!lang) {
    res.json({ error: "Language was not specified" });
  }
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

const translations = {
  en: {
    test: "This is a test",
    poi_find: "These are the points of interest i could find"
  },
  nl: {
    test: "Dit is een test",
    poi_find: "Dit zijn de bezienswaardigheden die ik kan vinden"
  },
  es: {
    test: "Hablo Español?",
    poi_find: "These are the points of interest i could find"
  },
  de: {
    test: "Das ist einen test!".toUpperCase(),
    poi_find: "These are the points of interest i could find"
  },
  fr: {
    test: "C'est un test",
    poi_find: "These are the points of interest i could find"
  }
};

exports = module.exports = {
  translations,
  langMiddleware
};
