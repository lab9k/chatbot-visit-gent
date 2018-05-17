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

const translations = {
  en: {
    test: "This is a test"
  },
  nl: {
    test: "Dit is een test"
  },
  es: {
    test: "Hablo Español?"
  },
  de: {
    test: "Das ist einen test!".toUpperCase()
  },
  fr: {
    test: "C'est un test"
  }
};

exports = module.exports = {
  translations,
  langMiddleware
};
