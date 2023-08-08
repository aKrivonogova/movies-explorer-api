const router = require('express').Router();
const { getUserMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { deleteMovieValidation, createMovieValidaation } = require('../middlewares/validation');

router.get('/movies', getUserMovies);
router.post('/movies', createMovieValidaation, createMovie);
router.delete('/movies/:id', deleteMovieValidation, deleteMovie);

module.exports = router;
