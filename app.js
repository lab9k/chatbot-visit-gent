const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const gfRouter = require('./routes/gf/index');

const EventMapper = require('./util/eventmapper');

const e = new EventMapper();
e.init();

app.get('/debug', (req, res) => {
  const { events } = e;
  const ret = [];
  events.forEach((ev) => {
    const included = ret.findIndex(el => el.name.nl === ev.name.nl);
    if (included === -1) {
      return ret.push({ ...ev, startDates: [ev.startDate] });
    }
    if (!ret[included].startDates) {
      ret[included].startDates = [];
    }
    return ret[included].startDates.push(ev.startDate);
  });
  res.json({
    count: ret.length,
    items: ret.map(el => ({
      name: el.name.nl,
      startDates: el.startDates,
      location: el.location
    }))
  });
});

app.use('/gentse_feesten', gfRouter);

module.exports = app;
