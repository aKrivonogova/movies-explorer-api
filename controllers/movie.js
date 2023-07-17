const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const STATUS_OK = 200;
const STATUS_OK_CREATE = 201;

const getUserMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.status(STATUS_OK).send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(STATUS_OK_CREATE).send({
      _id: movie._id,
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailerLink: movie.trailerLink,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      thumbnail: movie.thumbnail,
      movieId: movie.movieId,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Введены невалидные данные.');
      }
      return next(err);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id).select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет фильма с таким _id.');
      } else if (movie.owner.toString() !== req.user._id) {
        return new ForbiddenError('Невозможно удалить фильм другого пользователя.');
      }
      Movie.findByIdAndDelete(id).select('-owner')
        .then((deletedMovie) => res.status(STATUS_OK).send(deletedMovie));
    })
    .catch(next);
};

module.exports = { createMovie, getUserMovies, deleteMovie };
