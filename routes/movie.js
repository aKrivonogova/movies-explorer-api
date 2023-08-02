const router = require('express').Router();
const { getUserMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { deleteMovieValidation, createMovieValidaation } = require('../middlewares/validation');

//  получить список фильмов пользователя
router.get('/movies', getUserMovies);
//  добавить фильм
router.post('/movies', createMovieValidaation, createMovie);
//  удалить фильм по id
router.delete('/movies/:id', deleteMovieValidation, deleteMovie);

module.exports = router;
