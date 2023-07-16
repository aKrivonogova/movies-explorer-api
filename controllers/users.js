const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { SECRET } = process.env;
const jwt = require('jsonwebtoken');
const  DuplicateError = require('../errors/DuplicateError');
const  ValidationError  = require('../errors/ValidationError');
const  NotFoundError  = require('../errors/NotFoundError');

const STATUS_OK = 200;
const STATUS_OK_CREATE = 201;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      next(err);
    });
}

// обновить данные пользователя
const updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким _id.');
      } else {
        res.status(STATUS_OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Введены невалидные данные.');
      } else if (err.name === 'CastError') {
        throw new ValidationError('Введен невалидный _id пользователя.');
      } else if (err.name === 'DuplicateKey') {
        throw new DuplicateError('Пользователь с таким email уже существует.');
      }
      return next(err);
    })
    .catch(next);
}


//  регистрация пользователя
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, email, password: hash,
    }).then((user) => {
      res.status(STATUS_OK_CREATE).send({
        name: user.name,
        email: user.email,
      });
    })
      .catch((err) => {
        if (err.name === 'MongoServerError' && err.code === 1100) {
          return next(new DuplicateError('Пользователь с таким email уже существует'));
        }
        if (err.name === 'ValidationError') {
          return next(new ValidationError('Некорректные данные'));
        }
        return next(err);
      });
  });
}

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getCurrentUser, updateUserInfo, createUser, login }
