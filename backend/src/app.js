const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const routes = require('./api/routes');
const { errorHandler, notFoundHandler } = require('./api/middlewares/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());
app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
