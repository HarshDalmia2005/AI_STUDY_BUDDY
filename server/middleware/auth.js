const auth = (req, res, next) => {
  
  req.userId = '000000000000000000000000';
  next();
};

module.exports = auth;
