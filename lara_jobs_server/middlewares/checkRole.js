const checkRole = (roles) => {
    return (req, res, next) => {
      // If the user's role is not in the roles array, deny access
      if (!roles.includes(req.candidate.role)) {
        return res.status(403).json({ message: 'Access denied. You do not have permission.' });
      }
      
      // If the role is valid, allow access
      next();
    };
  };
  
  module.exports = checkRole;
  