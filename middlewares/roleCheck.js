const roleCheck = (role) => {
  return (req, res, next) => {
    if (req.session.CustomerId && req.session.role === role) {
      return next(); // Proceed if role matches
    }
    const error = 'Unauthorized access. Admins only.';
    res.redirect(`/login?error=${error}`);
  };
};

module.exports = roleCheck;