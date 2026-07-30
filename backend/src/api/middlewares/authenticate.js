const { AppError } = require('../../shared/errors/AppError');
const { asyncHandler } = require('../../shared/utils/asyncHandler');
const { verifyAccessToken } = require('../../modules/auth/token.service');
const repository = require('../../modules/auth/auth.repository');

const authenticate = asyncHandler(async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new AppError('Authentication is required.', 401, 'UNAUTHENTICATED');
  let payload;
  try { payload = verifyAccessToken(token); } catch { throw new AppError('Access token is invalid or expired.', 401, 'INVALID_ACCESS_TOKEN'); }
  const user = await repository.findUserById(payload.sub);
  if (!user) throw new AppError('Authentication is required.', 401, 'UNAUTHENTICATED');
  req.user = user;
  next();
});

module.exports = { authenticate };
