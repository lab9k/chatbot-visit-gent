exports = module.exports = idMiddleWare = (req, res, next) => {
  if (!req.query.id) return res.json({ error: "id url was not specified" });
  req.poi_id = req.query.id;
  next();
};
