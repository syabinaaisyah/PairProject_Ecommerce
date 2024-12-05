const { home, login, loginPage, register, registPage, logOut } = require('../controllers/ctrlLogin');
const { body, validationResult } = require('express-validator');
const router = require('express').Router();

const authenticatedRoutes = ['']; // Add your private routes here

router.use((req, res, next) => {
  if (authenticatedRoutes.includes(req.path) && !req.session.CustomerId) {
    const error = `Please login first!`;
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
});

router.get('/', home);
router.get('/login', login);
router.post('/login', loginPage);
router.get('/register', register);

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('dateOfBirth').notEmpty().withMessage('Date of Birth is required'),
    body('role').notEmpty().withMessage('Role is required'),
    body('gender').notEmpty().withMessage('Gender is required'),
  ],
  (req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('register', {
        errors: errors.array(),
        oldInput: req.body, 
      });
    }
    next();
  },
  registPage
);

router.get('/logout', logOut);

router.use(function (req, res, next) {
  if (!req.session.CustomerId) {
    const error = `Please login first!`;
    return res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
});

module.exports = router;