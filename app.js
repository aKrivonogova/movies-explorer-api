const express = require('express');
require('dotenv').config();
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const mongoose = require('mongoose');
const limiter = require('./middlewares/rateLimiter')
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const cors = require('./middlewares/cors');
const helmet = require('helmet');
const defaultErrorHandler = require('./middlewares/defaultErrorHandler');

const app = express();

const { PORT, BD_URL, NODE_ENV } = process.env;
mongoose.connect(NODE_ENV === 'production' ? BD_URL : 'mongodb://127.0.0.1/bitfilmsdb');

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
