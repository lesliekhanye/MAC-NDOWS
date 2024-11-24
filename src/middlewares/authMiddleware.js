export const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
      return next();
    }
    req.flash('error', 'Please log in to access this resource');
    res.redirect('/login');
  };
  
  export const redirectIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
      return res.redirect('/launchPage');
    }
    next();
  };