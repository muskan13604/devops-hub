const { refreshCookieOptions, clearRefreshCookieOptions } = require('../../config/cookies');
const authService = require('./auth.service');
const { asyncHandler } = require('../../shared/utils/asyncHandler');
const { validateCredentials } = require('./auth.validator');

function respond(res, payload, status = 200) {
  res.cookie('refreshToken', payload.refreshToken, refreshCookieOptions);
  return res.status(status).json({ data: { user: payload.user, accessToken: payload.accessToken } });
}

const register = asyncHandler(async (req, res) => respond(res, await authService.register(validateCredentials(req.body)), 201));
const login = asyncHandler(async (req, res) => respond(res, await authService.login(validateCredentials(req.body))));
const refresh = asyncHandler(async (req, res) => respond(res, await authService.refresh(req.cookies.refreshToken)));
const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies.refreshToken);
  res.clearCookie('refreshToken', clearRefreshCookieOptions);
  res.status(204).send();
});
const me = asyncHandler(async (req, res) => res.json({ data: { user: authService.presentUser(req.user) } }));

module.exports = { register, login, refresh, logout, me };
