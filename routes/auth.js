const { Router } = require('express');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const router = Router();
const { check } = require('express-validator');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post('/', [check('email', 'Email must be valid').isEmail(), check('password', 'Password cannot be empty').not().isEmpty()], login);

router.post('/google', [check('token', 'token google must be valid').not().isEmpty()], googleSignIn);

router.get('/renew', validateJWT, renewToken);

module.exports = router;
