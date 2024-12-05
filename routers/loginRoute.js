const { home, login, loginPage, register, registPage, logOut } = require('../controllers/ctrlLogin');
const validateRegister = require('../middlewares/validation');
const { validationResult } = require('express-validator');

const router = require('express').Router();

router.get('/', home);
router.get('/login', login);
router.post('/login', loginPage);
router.get('/register', register);
router.post(
    '/register',
    validateRegister, // Middleware validasi
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
      }
      next(); 
    },
    registPage
  );
router.get('/logout', logOut);

router.use(function (req, res, next) {
 if (!req.session.CustomerId) {
     const error = `Please login first!`
     return res.redirect(`/login?error=${error}`);
 }else {
     next()
 }
})

module.exports = router;
