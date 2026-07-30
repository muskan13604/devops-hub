const { AppError } = require('../../shared/errors/AppError');

/**
 * Middleware to restrict access based on user roles.
 * Must be used AFTER the `authenticate` middleware, which sets `req.user`.
 * 
 * @param  {...string} roles - The roles allowed to access the route (e.g., 'Admin', 'Developer').
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication is required.', 401, 'UNAUTHENTICATED'));
    }

    const userRole = req.user.role || 'Viewer';
    
    if (roles.length && !roles.includes(userRole)) {
      return next(new AppError('You do not have permission to perform this action.', 403, 'FORBIDDEN'));
    }
    
    next();
  };
}

module.exports = { authorize };
