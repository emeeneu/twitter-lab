const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const User = require('../models/user');

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if (username === '' || password === '') {
    const error = 'Usuario y password no pueden estar vacios';
    res.render('auth/signup', { error });
  } else {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt);
          const newUser = {
            username,
            password: hashPass,
          };
          User.create(newUser)
            .then((doc) => {
              res.redirect('/');
            })
            .catch((err) => {
              const error = 'Error en la creación del usuario';
              res.render('auth/signup', { error });
            });
        } else {
          const error = 'Usuario ya exsistente';
          res.render('auth/signup', { error });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
});

module.exports = router;
