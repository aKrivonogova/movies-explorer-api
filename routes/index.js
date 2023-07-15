const router = require('express').Router();
const userRoutes = require('./user');
const moviesRoutes = require('./movie');
const auth = require('../middlewares/auth')
const signRoutes = require('./sign');
const NotFoundError = require('../errors/NotFoundError')

router.use(signRoutes);
router.use(auth);
router.use(moviesRoutes);
router.use(userRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = router;