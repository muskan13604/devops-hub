const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const repository = require('./auth.repository');

function createAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email, type: 'access' }, env.accessTokenSecret, { expiresIn: env.accessTokenTtl });
}

async function createRefreshToken(user) {
  const tokenId = crypto.randomUUID();
  const token = jwt.sign({ sub: user._id.toString(), jti: tokenId, type: 'refresh' }, env.refreshTokenSecret, { expiresIn: env.refreshTokenTtl });
  const { exp } = jwt.decode(token);
  await repository.createSession({ userId: user._id, tokenId, expiresAt: new Date(exp * 1000), createdAt: new Date() });
  return token;
}

async function issueTokenPair(user) {
  return { accessToken: createAccessToken(user), refreshToken: await createRefreshToken(user) };
}

function verifyAccessToken(token) {
  const payload = jwt.verify(token, env.accessTokenSecret);
  if (payload.type !== 'access') throw new jwt.JsonWebTokenError('Incorrect token type');
  return payload;
}

function verifyRefreshToken(token) {
  const payload = jwt.verify(token, env.refreshTokenSecret);
  if (payload.type !== 'refresh' || !payload.jti) throw new jwt.JsonWebTokenError('Incorrect token type');
  return payload;
}

module.exports = { issueTokenPair, verifyAccessToken, verifyRefreshToken };
