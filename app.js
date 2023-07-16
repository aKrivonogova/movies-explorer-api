const express = require('express');
require('dotenv').config();
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');
const routes = require('./routes/index');
const cors = require('./middlewares/cors');
const defaultErrorHandler = require('./middlewares/defaultErrorHandler');

const app = express();

const { PORT, BD_URL } = process.env;
mongoose.connect(BD_URL);

app.use(cors);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(express.json());

app.use(routes);

app.use(errorLogger);
app.use(errors());

app.use(defaultErrorHandler);

app.listen(PORT, () => { });
