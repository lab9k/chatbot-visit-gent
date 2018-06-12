const express = require('express');
// const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const ExpressTranslate = require('express-translate');
const lang = require('./util/lang');
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(process.env.DB_CONNECTION_STRING);

const app = express();

const expressTranslate = new ExpressTranslate({ localeKey: 'loc' });
expressTranslate.addLanguages(lang.translations);
app.use(lang.langMiddleware);
app.use(expressTranslate.middleware());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const indexRouter = require('./routes/index');

app.use('/', indexRouter);
const gfRouter = require('./routes/gf/index');

app.use('/gentse_feesten', gfRouter);

module.exports = app;
