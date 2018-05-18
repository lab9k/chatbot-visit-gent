const mongoose = require("mongoose");

const User = mongoose.Schema({
  id: String,
  language: String
});

exports = module.exports = mongoose.Model("User", User);
