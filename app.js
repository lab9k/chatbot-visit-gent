var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");
const _ExpressTranslate = require("express-translate");

dotenv.config();

var app = express();

const expressTranslate = new _ExpressTranslate({ localeKey: "loc" });
expressTranslate.addLanguages({
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
});
app.use(expressTranslate.middleware());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

module.exports = app;
