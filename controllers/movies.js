const Movie = require('../models/movie');
const { SUCCESS_CODE } = require('../utils/constans');

const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movie) => res.status(SUCCESS_CODE).send({ data: movie }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
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
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(SUCCESS_CODE).send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации полей'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм по указанному _id не найден');
      } else if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Вы не можете удалить фильм');
      } else {
        movie.remove()
          .then(() => res.status(SUCCESS_CODE).send({ message: 'Фильм успешно удален' }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный ID'));
      } else {
        next(err);
      }
    });
};

// module.exports.likeCard = (req, res, next) => {
//   Movie.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .populate(['owner', 'likes'])
//     .then((movie) => {
//       if (!movie) {
//         throw new NotFoundError('Пользователь по указанному _id не найден');
//       }
//       res.status(SUCCESS_CODE).send({ movie });
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Передан невалидный ID'));
//       } else {
//         next(err);
//       }
//     });
// };

// module.exports.dislikeCard = (req, res, next) => {
//   Movie.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .populate(['owner', 'likes'])
//     .then((movie) => {
//       if (!movie) {
//         throw new NotFoundError('Пользователь по указанному _id не найден');
//       }
//       res.status(SUCCESS_CODE).send({ movie });
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Передан невалидный ID'));
//       } else {
//         next(err);
//       }
//     });
// };
