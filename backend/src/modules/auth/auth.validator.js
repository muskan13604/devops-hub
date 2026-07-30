const { AppError } = require('../../shared/errors/AppError');

function validateCredentials(payload = {}) {
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';
  const allowedRoles = ['Admin', 'Developer', 'Viewer'];
  const role = typeof payload.role === 'string' && allowedRoles.includes(payload.role) ? payload.role : 'Viewer';
  
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new AppError('A valid email address is required.', 400, 'VALIDATION_ERROR');
  if (password.length < 8 || password.length > 128) throw new AppError('Password must be 8 to 128 characters.', 400, 'VALIDATION_ERROR');
  
  return { email, password, role };
}

module.exports = { validateCredentials };
