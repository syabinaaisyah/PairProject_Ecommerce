const { home, login, loginPage, register, registPage, logOut } = require('../controllers/ctrlLogin');

const router = require('express').Router();

router.get('/', home);
router.get('/login', login);
router.post('/login', loginPage);
router.get('/register', register);
router.post('/register', registPage);
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
