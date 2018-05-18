var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");
const _ExpressTranslate = require("express-translate");
const lang = require("./util/lang");
const mongoose = require("mongoose");
dotenv.config();

mongoose.connect(process.env.DB_CONNECTION_STRING);

var app = express();

const expressTranslate = new _ExpressTranslate({ localeKey: "loc" });
expressTranslate.addLanguages(lang.translations);
//app.use(lang.langMiddleware);
app.use(expressTranslate.middleware());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

module.exports = app;
