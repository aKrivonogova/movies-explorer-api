const router = require('express').Router();
const { getUserMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { createMovieValidaation } = require('../middlewares/validation');

router.get('/movies', getUserMovies);
router.post('/movies', createMovieValidaation, createMovie);
router.delete('/movies/:movieId', deleteMovie);

module.exports = router;
