require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');

const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validationCreateUser, validationLogin } = require('./middlewares/validation');
const centralizedHandler = require('./middlewares/centralizedHandler');
const limiter = require('./middlewares/rateLimit');

const { PORT = 3001, MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const app = express();
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);

app.use(auth);
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый адрес не найден. Проверьте URL и метод запроса'));
});
app.use(errorLogger);
app.use(errors());
app.use(centralizedHandler);

async function connect() {
  await mongoose.connect(MONGO_URL);
  console.log(`Server connect db ${MONGO_URL}`);
  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

connect();
