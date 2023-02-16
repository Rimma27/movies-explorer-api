const movieRoutes = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  validationCreateMovie,
  validationMovieId,
} = require('../middlewares/validation');

movieRoutes.get('/', getMovies);

movieRoutes.post('/', validationCreateMovie, createMovie);

movieRoutes.delete('/:movieId', validationMovieId, deleteMovie);

module.exports = movieRoutes;
