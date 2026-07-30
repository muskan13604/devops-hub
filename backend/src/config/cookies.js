const env = require('./env');

const base = Object.freeze({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'strict',
  path: '/api/auth',
});

module.exports = {
  refreshCookieOptions: { ...base, maxAge: 7 * 24 * 60 * 60 * 1000 },
  clearRefreshCookieOptions: base,
};
