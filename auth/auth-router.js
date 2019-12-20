const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../users/user_model')
const secrets = require('../config/secrets')

router.post('/register', (req, res) => {
  const credentials = req.body
  const hash = bcrypt.hashSync(credentials.password, 14)
  credentials.password = hash
  userModel.addUser({username: credentials.username, password: credentials.password})
  .then(data => {
      res.status(201).json(data)
  })
  .catch(err => {
      res.status(500).json({message: "Failed to create new user"})
  })
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;
  
  userModel.findByUsername({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)
        res.status(200).json({ message: `Welcome ${user.username}!`, token });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, secrets.jwtSecret, options)
}