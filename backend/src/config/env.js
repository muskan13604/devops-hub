const dotenv = require('dotenv');

dotenv.config();

const required = ['MONGODB_URI', 'MONGODB_DB_NAME'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`${key} must be defined in the environment.`);
}

const port = Number(process.env.PORT || 5000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port.');
}

module.exports = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port,
  mongoUri: process.env.MONGODB_URI,
  mongoDbName: process.env.MONGODB_DB_NAME,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
});
