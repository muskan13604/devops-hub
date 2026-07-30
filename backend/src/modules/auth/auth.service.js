const bcrypt = require('bcryptjs');
const { AppError } = require('../../shared/errors/AppError');
const repository = require('./auth.repository');
const { issueTokenPair, verifyRefreshToken } = require('./token.service');

const presentUser = (user) => ({ id: user._id.toString(), email: user.email, role: user.role || 'Viewer', createdAt: user.createdAt });

async function register({ email, password, role }) {
  if (await repository.findUserByEmail(email)) throw new AppError('An account with this email already exists.', 409, 'EMAIL_IN_USE');
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const result = await repository.createUser({ email, passwordHash, role });
    const user = await repository.findUserById(result.insertedId.toString());
    return { user: presentUser(user), ...(await issueTokenPair(user)) };
  } catch (error) {
    if (error.code === 11000) throw new AppError('An account with this email already exists.', 409, 'EMAIL_IN_USE');
    throw error;
  }
}

async function login({ email, password }) {
  const user = await repository.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }
  return { user: presentUser(user), ...(await issueTokenPair(user)) };
}

async function refresh(token) {
  try {
    const payload = verifyRefreshToken(token);
    const session = await repository.consumeSession(payload.jti, payload.sub);
    if (!session) throw new AppError('Refresh token is invalid or has already been used.', 401, 'INVALID_REFRESH_TOKEN');
    const user = await repository.findUserById(payload.sub);
    if (!user) throw new AppError('Refresh token is invalid.', 401, 'INVALID_REFRESH_TOKEN');
    return { user: presentUser(user), ...(await issueTokenPair(user)) };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Refresh token is invalid or expired.', 401, 'INVALID_REFRESH_TOKEN');
  }
}

async function logout(token) {
  if (!token) return;
  try {
    const payload = verifyRefreshToken(token);
    await repository.deleteSession(payload.jti, payload.sub);
  } catch {
    // Logout remains idempotent, even for an expired or malformed cookie.
  }
}

module.exports = { register, login, refresh, logout, presentUser };
