/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken')
const secrets = require('../config/secrets')

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const secret = process.env.JWT_SECRET || secrets.jwtSecret;

    jwt.verify(authorization, secret, function(err, decodedToken) {
      if (err) {
        res.status(401).json({ message: "Invalid Token" });
      } else {
        req.token = decodedToken;

        next();
      }
    });
  } else {
    res.status(400).json({ message: "Please login and try again" });
  }
};
